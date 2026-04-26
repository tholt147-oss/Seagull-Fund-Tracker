import { NextResponse } from 'next/server';

const RANGE_CONFIG = {
  '1d':  { interval: '5min',  outputsize: 78,  cacheTTL: 5 * 60 * 1000 },
  '1w':  { interval: '15min', outputsize: 130, cacheTTL: 15 * 60 * 1000 },
  '1m':  { interval: '1h',    outputsize: 154, cacheTTL: 30 * 60 * 1000 },
  '1y':  { interval: '1day',  outputsize: 252, cacheTTL: 60 * 60 * 1000 },
  '5y':  { interval: '1week', outputsize: 260, cacheTTL: 60 * 60 * 1000 },
};

// In-memory cache: { [symbol-range]: { data, timestamp } }
// Use global to survive Next.js dev-mode hot reloads
const cache = global.__chartCache ?? (global.__chartCache = {});

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');
  const range = searchParams.get('range') ?? '1d';

  if (!symbol) {
    return NextResponse.json({ error: 'symbol query parameter is required' }, { status: 400 });
  }

  const config = RANGE_CONFIG[range];
  if (!config) {
    return NextResponse.json(
      { error: `Invalid range. Must be one of: ${Object.keys(RANGE_CONFIG).join(', ')}` },
      { status: 400 }
    );
  }

  const apiKey = process.env.TWELVEDATA_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'TWELVEDATA_API_KEY not configured' }, { status: 500 });
  }

  const { interval, outputsize, cacheTTL } = config;
  // SPY is a shared benchmark — cache it twice as long
  const effectiveTTL = symbol.toUpperCase() === 'SPY' ? cacheTTL * 2 : cacheTTL;
  const cacheKey = `${symbol.toUpperCase()}-${range}`;
  const now = Date.now();
  const cached = cache[cacheKey];

  if (cached && now - cached.timestamp < effectiveTTL) {
    return NextResponse.json(cached.data);
  }

  try {
    const url = `https://api.twelvedata.com/time_series?symbol=${encodeURIComponent(symbol)}&interval=${interval}&outputsize=${outputsize}&apikey=${apiKey}`;
    const res = await fetch(url, { next: { revalidate: 0 } });
    const json = await res.json();

    if (
      res.status === 429 ||
      (json.status === 'error' && json.message?.toLowerCase().includes('rate limit'))
    ) {
      if (cached) return NextResponse.json(cached.data);
      return NextResponse.json(
        { error: 'Rate limit reached — try again in a moment', rateLimited: true },
        { status: 429 }
      );
    }

    if (json.status === 'error') {
      if (cached) return NextResponse.json(cached.data);
      return NextResponse.json({ error: json.message ?? 'Twelve Data error' }, { status: 502 });
    }

    if (!json.values || !Array.isArray(json.values)) {
      if (cached) return NextResponse.json(cached.data);
      return NextResponse.json({ error: `No data returned for ${symbol}` }, { status: 502 });
    }

    const values = json.values
      .slice()
      .reverse()
      .map(v => ({
        datetime: v.datetime,
        open: parseFloat(v.open),
        high: parseFloat(v.high),
        low: parseFloat(v.low),
        close: parseFloat(v.close),
        volume: parseInt(v.volume, 10),
      }));

    const data = {
      symbol: symbol.toUpperCase(),
      range,
      interval,
      values,
      lastUpdated: new Date().toISOString(),
    };

    cache[cacheKey] = { data, timestamp: now };
    return NextResponse.json(data);
  } catch (err) {
    console.error(`[chart] fetch error for ${symbol} (${range}):`, err);
    if (cached) return NextResponse.json(cached.data);
    return NextResponse.json({ error: 'Failed to fetch chart data' }, { status: 502 });
  }
}
