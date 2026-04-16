'use client';

import { useEffect, useState, useCallback } from 'react';
import { ArrowUpRight, ArrowDownRight, RefreshCw, TrendingUp } from 'lucide-react';
import IntradayChart from './IntradayChart';

export default function SP500Benchmark() {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchQuote = useCallback(async () => {
    try {
      const res = await fetch('/api/benchmark');
      if (!res.ok) throw new Error('Failed to fetch benchmark data');
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setQuote(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuote();
    const interval = setInterval(fetchQuote, 60000);
    return () => clearInterval(interval);
  }, [fetchQuote]);

  const isUp = quote?.change == null || quote.change >= 0;

  return (
    <section className="max-w-7xl mx-auto px-6 pt-16 pb-4">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-5 h-5 text-gold-500" />
            <h2 className="text-2xl font-display font-bold text-maroon-800">
              Benchmark Performance
            </h2>
          </div>
          <div className="h-1 w-16 bg-gold-500 rounded mb-2" />
          <p className="text-sm text-gray-500">
            S&amp;P 500 (SPY) &mdash; the index the Sea Gull Fund aims to beat
          </p>
        </div>
        {quote?.lastUpdated && (
          <span className="text-xs text-gray-400 mt-2 md:mt-0">
            Last updated: {new Date(quote.lastUpdated).toLocaleTimeString()}
          </span>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border-2 border-gold-500 p-6">
        {loading && (
          <div className="flex items-center justify-center gap-3 py-16 text-sm text-gray-400">
            <RefreshCw className="w-4 h-4 animate-spin" />
            Loading benchmark data…
          </div>
        )}

        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <p className="text-sm text-gray-400">Benchmark data unavailable.</p>
            <p className="text-xs text-gray-400 font-mono bg-gray-50 px-3 py-1.5 rounded border border-gray-200">
              {error}
            </p>
          </div>
        )}

        {!loading && !error && quote && (
          <>
            {/* Quote bar */}
            <div className="flex flex-wrap items-center gap-6 mb-6">
              {/* Price */}
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-0.5">Price</p>
                <p className="text-3xl font-bold font-mono text-gray-900">
                  ${quote.price?.toFixed(2)}
                </p>
              </div>

              {/* Change */}
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-0.5">Change</p>
                <span className={`inline-flex items-center gap-1 text-xl font-bold font-mono ${
                  isUp ? 'text-green-600' : 'text-red-600'
                }`}>
                  {isUp ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                  {quote.change > 0 ? '+' : ''}{quote.change?.toFixed(2)}
                </span>
              </div>

              {/* % Change */}
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-0.5">% Change</p>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${
                  isUp
                    ? 'bg-green-50 text-green-700 ring-1 ring-green-200'
                    : 'bg-red-50 text-red-700 ring-1 ring-red-200'
                }`}>
                  {quote.changePercent > 0 ? '+' : ''}{quote.changePercent?.toFixed(2)}%
                </span>
              </div>

              {/* Day range */}
              <div className="ml-auto text-right hidden sm:block">
                <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-0.5">Day Range</p>
                <p className="text-sm font-mono text-gray-600">
                  ${quote.low?.toFixed(2)} – ${quote.high?.toFixed(2)}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Prev close: ${quote.prevClose?.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Intraday chart */}
            <IntradayChart
              ticker="SPY"
              currentPrice={quote.price}
              previousClose={quote.prevClose}
            />
          </>
        )}
      </div>
    </section>
  );
}
