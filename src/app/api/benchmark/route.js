import { NextResponse } from 'next/server';

const SYMBOL = 'SPY'; // S&P 500 ETF — benchmark for the Sea Gull Fund

let cache = null;
let cacheTimestamp = 0;
const CACHE_TTL = 60 * 1000; // 60 seconds

export async function GET() {
  const apiKey = process.env.FINNHUB_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'FINNHUB_API_KEY not configured' }, { status: 500 });
  }

  const now = Date.now();
  if (cache && now - cacheTimestamp < CACHE_TTL) {
    return NextResponse.json(cache);
  }

  try {
    const res = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${SYMBOL}&token=${apiKey}`,
      { next: { revalidate: 0 } }
    );
    const quote = await res.json();

    const data = {
      symbol: SYMBOL,
      price: quote.c,
      change: quote.d,
      changePercent: quote.dp,
      high: quote.h,
      low: quote.l,
      open: quote.o,
      prevClose: quote.pc,
      timestamp: quote.t,
      lastUpdated: new Date().toISOString(),
    };

    cache = data;
    cacheTimestamp = now;
    return NextResponse.json(data);
  } catch (err) {
    console.error('[benchmark] fetch error:', err);
    if (cache) return NextResponse.json(cache);
    return NextResponse.json({ error: 'Failed to fetch benchmark data' }, { status: 502 });
  }
}
