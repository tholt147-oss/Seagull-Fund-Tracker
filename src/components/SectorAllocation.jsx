'use client';

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { SECTOR_ALLOCATION, ALLOCATION_AS_OF } from '../data/sectors';
import { SECTOR_STOCK_COUNTS } from '../data/companyInfo';

const SECTOR_COLORS = {
  'Energy': '#ca8a04',
  'Materials': '#92400e',
  'Industrials': '#6366f1',
  'Consumer Discretionary': '#c026d3',
  'Consumer Staples': '#be185d',
  'Health Care': '#059669',
  'Financials': '#0891b2',
  'Information Technology': '#4f46e5',
  'Communication Services': '#ea580c',
  'Utilities': '#0d9488',
  'Real Estate': '#7c3aed',
};

const MAX_WEIGHT = Math.max(
  ...SECTOR_ALLOCATION.flatMap(s => [s.currentWeight, s.targetWeight, s.sp500Weight])
);

function ActionBadge({ action }) {
  const isBuy = action.startsWith('+');
  const isSell = action.startsWith('-');

  if (isBuy) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 ring-1 ring-green-200">
        <TrendingUp className="w-3 h-3" />
        Buy {action}
      </span>
    );
  }
  if (isSell) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 ring-1 ring-red-200">
        <TrendingDown className="w-3 h-3" />
        Sell {action}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-gray-50 text-gray-600 ring-1 ring-gray-200">
      <Minus className="w-3 h-3" />
      Hold
    </span>
  );
}

function WeightBar({ label, value, color, maxWeight }) {
  const pct = Math.min((value / maxWeight) * 100, 100);
  return (
    <div className="flex items-center gap-2">
      <span className="w-16 text-xs text-gray-500 text-right shrink-0">{label}</span>
      <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
        <div
          className="h-2 rounded-full transition-all"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span className="w-12 text-xs font-mono text-gray-700 text-right shrink-0">
        {value.toFixed(2)}%
      </span>
    </div>
  );
}

function SectorCard({ sector }) {
  const deltaToTarget = sector.targetWeight - sector.currentWeight;
  const deltaVsSP = sector.currentWeight - sector.sp500Weight;
  const color = SECTOR_COLORS[sector.sector] || '#94a3b8';
  const numStocks = SECTOR_STOCK_COUNTS[sector.sector] ?? 0;

  const deltaTargetColor =
    deltaToTarget > 0.5 ? 'text-green-600' :
    deltaToTarget < -0.5 ? 'text-red-600' :
    'text-gray-500';

  const deltaSPColor =
    deltaVsSP > 0.5 ? 'text-red-600' :
    deltaVsSP < -0.5 ? 'text-green-600' :
    'text-gray-500';

  return (
    <div className="bg-white rounded-2xl shadow-sm border-2 border-gold-500 p-5 flex flex-col gap-4">
      {/* Card header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: color }} />
          <div className="min-w-0">
            <p className="font-bold text-gray-900 text-sm leading-snug truncate">{sector.sector}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              GICS {sector.gics} &middot; {numStocks} stock{numStocks !== 1 ? 's' : ''} held
            </p>
          </div>
        </div>
        <ActionBadge action={sector.action} />
      </div>

      {/* Weight bars */}
      <div className="space-y-2">
        <WeightBar label="Current" value={sector.currentWeight} color="#862633" maxWeight={MAX_WEIGHT} />
        <WeightBar label="Target" value={sector.targetWeight} color="#C5A44A" maxWeight={MAX_WEIGHT} />
        <WeightBar label="S&P 500" value={sector.sp500Weight} color="#9ca3af" maxWeight={MAX_WEIGHT} />
      </div>

      {/* Delta row */}
      <div className="flex items-center justify-between pt-1 border-t border-gray-50 text-xs font-medium">
        <span className="text-gray-400">Δ to Target</span>
        <span className={deltaTargetColor}>
          {deltaToTarget > 0 ? '+' : ''}{deltaToTarget.toFixed(2)}%
        </span>
        <span className="text-gray-300">|</span>
        <span className="text-gray-400">vs S&P</span>
        <span className={deltaSPColor}>
          {deltaVsSP > 0 ? '+' : ''}{deltaVsSP.toFixed(2)}%
        </span>
      </div>
    </div>
  );
}

export default function SectorAllocation() {
  const sorted = [...SECTOR_ALLOCATION].sort((a, b) => b.currentWeight - a.currentWeight);

  return (
    <section id="allocation" className="bg-gradient-to-b from-gray-50 to-white py-16">
      <div className="max-w-7xl mx-auto px-6">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8">
        <div>
          <h2 className="text-2xl font-display font-bold text-maroon-800 mb-1">
            Sector Allocation &amp; Rebalancing Targets
          </h2>
          <div className="gold-divider w-16 mb-4" />
        </div>
        <span className="text-xs text-gray-400 font-medium mb-1">As of {ALLOCATION_AS_OF}</span>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-5 mb-8 bg-white rounded-xl border-2 border-gold-500 shadow-sm px-5 py-3">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mr-1">Legend</span>
        <span className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
          <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#862633' }} />
          Current Weight
        </span>
        <span className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
          <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#C5A44A' }} />
          Target Weight
        </span>
        <span className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
          <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#9ca3af' }} />
          S&P 500 Benchmark
        </span>
      </div>

      {/* Sector Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        {sorted.map(s => (
          <SectorCard key={s.gics} sector={s} />
        ))}
      </div>

      </div>
    </section>
  );
}
