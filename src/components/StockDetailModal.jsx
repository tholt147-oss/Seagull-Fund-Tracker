'use client';

import { useEffect, useRef } from 'react';
import { X, ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown, Calendar, DollarSign } from 'lucide-react';
import { HOLDING_LOTS, LOTS_AS_OF } from '../data/holdingLots';
import StockChart from './StockChart';

const fmt = (n) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
const fmtPct = (n) => `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`;

function daysHeld(dateStr) {
  const purchase = new Date(dateStr + 'T00:00:00');
  const now = new Date();
  return Math.floor((now - purchase) / (1000 * 60 * 60 * 24));
}

function formatDate(dateStr) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

export default function StockDetailModal({ stock, onClose }) {
  const panelRef = useRef(null);
  const closeRef = useRef(null);

  // Escape key + focus on mount — guard inside so hook always runs
  useEffect(() => {
    if (!stock) return;
    closeRef.current?.focus();
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [stock, onClose]);

  // Focus trap
  useEffect(() => {
    if (!stock) return;
    const panel = panelRef.current;
    if (!panel) return;
    const focusable = panel.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const trap = (e) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    panel.addEventListener('keydown', trap);
    return () => panel.removeEventListener('keydown', trap);
  }, [stock]);

  // Early return if no stock or no lots — placed AFTER all hooks
  if (!stock || !HOLDING_LOTS[stock.ticker]) return null;

  const lots = HOLDING_LOTS[stock.ticker];
  const price = stock.price ?? 0;

  // Per-lot calculations
  const computed = lots
    .slice()
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map(lot => {
      const costBasis = lot.shares * lot.unitCost;
      const currentValue = lot.shares * price;
      const gainLossDollar = currentValue - costBasis;
      const gainLossPercent = (gainLossDollar / costBasis) * 100;
      return { ...lot, costBasis, currentValue, gainLossDollar, gainLossPercent, days: daysHeld(lot.date) };
    });

  // Aggregates
  const totalShares = computed.reduce((s, l) => s + l.shares, 0);
  const totalCostBasis = computed.reduce((s, l) => s + l.costBasis, 0);
  const totalMarketValue = totalShares * price;
  const totalGainLoss = totalMarketValue - totalCostBasis;
  const totalGainLossPercent = (totalGainLoss / totalCostBasis) * 100;
  const weightedAvgCost = totalCostBasis / totalShares;
  const avgVsCurrent = price - weightedAvgCost;
  const avgVsCurrentPct = (avgVsCurrent / weightedAvgCost) * 100;

  const isGain = totalGainLoss >= 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`${stock.ticker} purchase history`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl flex flex-col"
      >
        {/* Modal Header */}
        <div className="bg-maroon-800 text-white px-6 py-5 rounded-t-2xl flex items-start justify-between gap-4 sticky top-0 z-10">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-3xl font-display font-bold tracking-tight">{stock.ticker}</span>
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-white/15 text-white/80">
                {stock.sector}
              </span>
            </div>
            <p className="text-white/70 text-sm">{stock.name}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-2xl font-bold font-mono">{fmt(price)}</p>
            <p className={`text-sm font-medium flex items-center justify-end gap-1 ${
              stock.change > 0 ? 'text-green-300' : stock.change < 0 ? 'text-red-300' : 'text-white/50'
            }`}>
              {stock.change > 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : stock.change < 0 ? <ArrowDownRight className="w-3.5 h-3.5" /> : null}
              {stock.change > 0 ? '+' : ''}{stock.change?.toFixed(2)} ({stock.changePercent > 0 ? '+' : ''}{stock.changePercent?.toFixed(2)}%) today
            </p>
          </div>
          <button
            ref={closeRef}
            onClick={onClose}
            className="mt-0.5 shrink-0 p-1.5 rounded-lg hover:bg-white/20 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Company Description */}
          {stock.description && (
            <div className="bg-stone-50 rounded-xl border border-stone-200 px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">About</p>
              <p className="text-sm text-gray-700 leading-relaxed">{stock.description}</p>
            </div>
          )}

          {/* Position Summary */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Position Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard icon={<Calendar className="w-4 h-4 text-maroon-800" />} label="Total Shares" value={totalShares.toLocaleString()} />
              <StatCard icon={<DollarSign className="w-4 h-4 text-maroon-800" />} label="Cost Basis" value={fmt(totalCostBasis)} mono />
              <StatCard icon={<TrendingUp className="w-4 h-4 text-maroon-800" />} label="Market Value" value={fmt(totalMarketValue)} mono />
              <div className={`rounded-xl border p-4 flex flex-col gap-1 ${
                isGain ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }`}>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Unrealized P&L</p>
                <p className={`text-lg font-bold font-mono ${isGain ? 'text-green-700' : 'text-red-700'}`}>
                  {fmt(totalGainLoss)}
                </p>
                <p className={`text-xs font-semibold ${isGain ? 'text-green-600' : 'text-red-600'}`}>
                  {fmtPct(totalGainLossPercent)}
                </p>
              </div>
            </div>
          </div>

          {/* Weighted Average Cost */}
          <div className="bg-gray-50 rounded-xl border-2 border-gold-500 px-5 py-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-0.5">Weighted Avg Cost</p>
              <p className="text-xl font-bold font-mono text-gray-900">{fmt(weightedAvgCost)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-0.5">vs Current Price</p>
              <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-bold ${
                avgVsCurrent >= 0
                  ? 'bg-green-100 text-green-700 ring-1 ring-green-200'
                  : 'bg-red-100 text-red-700 ring-1 ring-red-200'
              }`}>
                {avgVsCurrent >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                {avgVsCurrent >= 0 ? '+' : ''}{fmt(avgVsCurrent)} ({fmtPct(avgVsCurrentPct)})
              </span>
            </div>
          </div>

          {/* Performance Chart */}
          <div className="bg-white rounded-xl border-2 border-gold-500 p-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-maroon-800 mb-1">Performance</h3>
            <div className="h-0.5 w-10 bg-gold-500 rounded mb-4" />
            <StockChart
              ticker={stock.ticker}
              currentPrice={stock.price}
              previousClose={stock.prevClose}
            />
          </div>

          {/* Purchase History Table */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Purchase History</h3>
            <div className="rounded-xl border-2 border-gold-500 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                      <th className="px-4 py-3 text-left font-semibold">Date</th>
                      <th className="px-4 py-3 text-right font-semibold">Days</th>
                      <th className="px-4 py-3 text-right font-semibold">Shares</th>
                      <th className="px-4 py-3 text-right font-semibold">Price</th>
                      <th className="px-4 py-3 text-right font-semibold">Cost Basis</th>
                      <th className="px-4 py-3 text-right font-semibold">Curr. Value</th>
                      <th className="px-4 py-3 text-right font-semibold">G/L $</th>
                      <th className="px-4 py-3 text-right font-semibold">G/L %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {computed.map((lot, i) => {
                      const isSell = lot.shares < 0;
                      const gain = lot.gainLossDollar >= 0;
                      if (isSell) {
                        return (
                          <tr key={i} className={`border-t border-gray-100 bg-red-50/40`}>
                            <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">{formatDate(lot.date)}</td>
                            <td className="px-4 py-3 text-right text-gray-500">{lot.days}d</td>
                            <td className="px-4 py-3 text-right font-mono">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700 ring-1 ring-red-200">
                                Sell −{Math.abs(lot.shares).toLocaleString()}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right font-mono text-gray-700">{fmt(lot.unitCost)}</td>
                            <td className="px-4 py-3 text-right font-mono text-gray-500 italic text-xs">Proceeds: {fmt(Math.abs(lot.costBasis))}</td>
                            <td className="px-4 py-3 text-right text-gray-300">—</td>
                            <td className="px-4 py-3 text-right text-gray-300">—</td>
                            <td className="px-4 py-3 text-right text-gray-300">—</td>
                          </tr>
                        );
                      }
                      return (
                        <tr key={i} className={`border-t border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                          <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">{formatDate(lot.date)}</td>
                          <td className="px-4 py-3 text-right text-gray-500">{lot.days}d</td>
                          <td className="px-4 py-3 text-right font-mono text-gray-700">{lot.shares.toLocaleString()}</td>
                          <td className="px-4 py-3 text-right font-mono text-gray-700">{fmt(lot.unitCost)}</td>
                          <td className="px-4 py-3 text-right font-mono text-gray-700">{fmt(lot.costBasis)}</td>
                          <td className="px-4 py-3 text-right font-mono text-gray-700">{fmt(lot.currentValue)}</td>
                          <td className={`px-4 py-3 text-right font-mono font-medium ${gain ? 'text-green-600' : 'text-red-600'}`}>
                            {lot.gainLossDollar >= 0 ? '+' : ''}{fmt(lot.gainLossDollar)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                              gain
                                ? 'bg-green-50 text-green-700 ring-1 ring-green-200'
                                : 'bg-red-50 text-red-700 ring-1 ring-red-200'
                            }`}>
                              {fmtPct(lot.gainLossPercent)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                    {/* Totals row */}
                    <tr className="border-t-2 border-maroon-800 bg-maroon-800 text-white font-semibold">
                      <td className="px-4 py-3 text-xs uppercase tracking-wide">Total</td>
                      <td className="px-4 py-3" />
                      <td className="px-4 py-3 text-right font-mono">{totalShares.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right font-mono text-white/70">{fmt(weightedAvgCost)}<span className="text-xs ml-1 text-white/50">avg</span></td>
                      <td className="px-4 py-3 text-right font-mono">{fmt(totalCostBasis)}</td>
                      <td className="px-4 py-3 text-right font-mono">{fmt(totalMarketValue)}</td>
                      <td className={`px-4 py-3 text-right font-mono ${isGain ? 'text-green-300' : 'text-red-300'}`}>
                        {totalGainLoss >= 0 ? '+' : ''}{fmt(totalGainLoss)}
                      </td>
                      <td className={`px-4 py-3 text-right font-mono text-sm ${isGain ? 'text-green-300' : 'text-red-300'}`}>
                        {fmtPct(totalGainLossPercent)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <p className="text-xs text-gray-400 text-center leading-relaxed">
            Lot data as of {LOTS_AS_OF}. Prices update live every 60 seconds.{' '}
            Past performance does not guarantee future results.
          </p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, mono = false }) {
  return (
    <div className="bg-white rounded-xl border-2 border-gold-500 p-4 flex flex-col gap-1">
      <div className="flex items-center gap-1.5 mb-0.5">{icon}<p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p></div>
      <p className={`text-base font-bold text-gray-900 ${mono ? 'font-mono' : ''}`}>{value}</p>
    </div>
  );
}
