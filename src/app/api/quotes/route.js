import { NextResponse } from 'next/server';
import { COMPANY_INFO } from '../../../data/companyInfo';

// In-memory cache: { [ticker]: { data, timestamp } }
// Use global to survive Next.js dev-mode hot reloads
const cache = global.__quotesCache ?? (global.__quotesCache = {});
const CACHE_TTL = 60 * 1000; // 60 seconds

// Derive the tickers list directly from COMPANY_INFO so adding/removing
// a holding in companyInfo.js is the only change needed.
const HOLDINGS = Object.keys(COMPANY_INFO);

async function fetchQuote(ticker, apiKey) {
  const now = Date.now();

  // Return cached if fresh
  if (cache[ticker] && (now - cache[ticker].timestamp) < CACHE_TTL) {
    return cache[ticker].data;
  }

  try {
    const res = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${apiKey}`
    );
    const quote = await res.json();

    // Finnhub quote fields: c=current, d=change, dp=percent change,
    // h=high, l=low, o=open, pc=previous close, t=timestamp
    const data = {
      ticker,
      ...COMPANY_INFO[ticker],
      price: quote.c,
      change: quote.d,
      changePercent: quote.dp,
      high: quote.h,
      low: quote.l,
      open: quote.o,
      prevClose: quote.pc,
      timestamp: quote.t,
    };

    cache[ticker] = { data, timestamp: now };
    return data;
  } catch (err) {
    console.error(`Error fetching ${ticker}:`, err);
    // Return stale cache if available
    if (cache[ticker]) return cache[ticker].data;
    return {
      ticker,
      ...COMPANY_INFO[ticker],
      price: 0,
      change: 0,
      changePercent: 0,
      error: true,
    };
  }
}

export async function GET() {
  const apiKey = process.env.FINNHUB_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'FINNHUB_API_KEY not configured' },
      { status: 500 }
    );
  }

  // Fetch all quotes with rate limiting (stagger requests)
  const results = [];
  for (let i = 0; i < HOLDINGS.length; i++) {
    const data = await fetchQuote(HOLDINGS[i], apiKey);
    results.push(data);

    // Small delay to respect rate limits (60/min = 1/sec safe)
    if (!cache[HOLDINGS[i]] || (Date.now() - cache[HOLDINGS[i]].timestamp) >= CACHE_TTL) {
      await new Promise(r => setTimeout(r, 100));
    }
  }

  return NextResponse.json({
    holdings: results,
    lastUpdated: new Date().toISOString(),
    count: results.length,
  });
}
