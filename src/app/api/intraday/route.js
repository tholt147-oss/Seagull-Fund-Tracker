import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');
  const url = new URL('/api/chart', request.url);
  if (symbol) url.searchParams.set('symbol', symbol);
  url.searchParams.set('range', '1d');
  return NextResponse.redirect(url);
}
