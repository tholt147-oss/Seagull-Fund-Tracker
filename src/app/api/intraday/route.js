import { NextResponse } from 'next/server';

// In-memory cache: { [symbol]: { data, timestamp } }
const cache = {};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');

  if (!symbol) {
    return NextResponse.json({ error: 'symbol query parameter is required' }, { status: 400 });
  }

  const apiKey = process.env.TWELVEDATA_API_KEY;
  console.log('[intraday] TWELVEDATA_API_KEY present:', !!apiKey);
  console.log('[intraday] Fetching symbol:', symbol);

  if (!apiKey) {
    return NextResponse.json({ error: 'TWELVEDATA_API_KEY not configured' }, { status: 500 });
  }

  const now = Date.now();
  const cached = cache[symbol];

  // Return fresh cache
  if (cached && now - cached.timestamp < CACHE_TTL) {
    return NextResponse.json(cached.data);
  }

  try {
    const url = `https://api.twelvedata.com/time_series?symbol=${encodeURIComponent(symbol)}&interval=5min&outputsize=78&apikey=${apiKey}`;
    const res = await fetch(url, { next: { revalidate: 0 } });
    const json = await res.json();
    console.log('[intraday] Twelve Data response for', symbol, ':', JSON.stringify(json).slice(0, 300));

    // Twelve Data returns { status: "error", message: "..." } on failure (with HTTP 200)
    if (json.status === 'error') {
      // Return stale cache if available
      if (cached) return NextResponse.json(cached.data);
      return NextResponse.json({ error: json.message ?? 'Twelve Data error' }, { status: 502 });
    }

    if (!json.values || !Array.isArray(json.values)) {
      if (cached) return NextResponse.json(cached.data);
      return NextResponse.json({ error: `No data returned for ${symbol} — response: ${JSON.stringify(json).slice(0, 100)}` }, { status: 502 });
    }

    // Twelve Data returns newest-first — reverse to chronological order
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
      interval: '5min',
      values,
      lastUpdated: new Date().toISOString(),
    };

    cache[symbol] = { data, timestamp: now };
    return NextResponse.json(data);
  } catch (err) {
    console.error(`[intraday] fetch error for ${symbol}:`, err);
    // Return stale cache if available
    if (cached) return NextResponse.json(cached.data);
    return NextResponse.json({ error: 'Failed to fetch intraday data' }, { status: 502 });
  }
}
