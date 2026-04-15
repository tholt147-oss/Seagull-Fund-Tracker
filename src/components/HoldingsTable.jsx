'use client';

import { useState, useEffect, useCallback } from 'react';
import { ArrowUpRight, ArrowDownRight, RefreshCw, TrendingUp, TrendingDown, Minus, ChevronRight } from 'lucide-react';
import { HOLDING_LOTS } from '../data/holdingLots';
import StockDetailModal from './StockDetailModal';

const SECTOR_COLORS = {
  'Information Technology': '#4f46e5',
  'Financials': '#0891b2',
  'Consumer Discretionary': '#c026d3',
  'Health Care': '#059669',
  'Communication Services': '#ea580c',
  'Energy': '#ca8a04',
  'Industrials': '#6366f1',
  'Utilities': '#0d9488',
  'Real Estate': '#7c3aed',
  'Consumer Staples': '#be185d',
  'Materials': '#92400e',
  'ETF': '#64748b',
};

export default function HoldingsTable() {
  const [holdings, setHoldings] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortField, setSortField] = useState('ticker');
  const [sortDir, setSortDir] = useState('asc');
  const [filterSector, setFilterSector] = useState('All');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'sector'
  const [selectedStock, setSelectedStock] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/quotes');
      if (!res.ok) throw new Error('Failed to fetch quotes');
      const data = await res.json();
      setHoldings(data.holdings);
      setLastUpdated(data.lastUpdated);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // Sorting
  const sorted = [...holdings].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];
    if (typeof aVal === 'string') aVal = aVal.toLowerCase();
    if (typeof bVal === 'string') bVal = bVal.toLowerCase();
    if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  // Filtering
  const filtered = filterSector === 'All'
    ? sorted
    : sorted.filter(h => h.sector === filterSector);

  const sectors = ['All', ...new Set(holdings.map(h => h.sector).sort())];

  // Group holdings by sector for sector view
  const bySector = sorted.reduce((acc, h) => {
    if (!acc[h.sector]) acc[h.sector] = [];
    acc[h.sector].push(h);
    return acc;
  }, {});

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  // Summary stats
  const gainers = holdings.filter(h => h.change > 0).length;
  const losers = holdings.filter(h => h.change < 0).length;
  const unchanged = holdings.filter(h => h.change === 0).length;

  // Sector breakdown
  const sectorCounts = holdings.reduce((acc, h) => {
    acc[h.sector] = (acc[h.sector] || 0) + 1;
    return acc;
  }, {});

  if (loading) {
    return (
      <section id="holdings" className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center justify-center gap-3 py-32">
          <RefreshCw className="w-6 h-6 text-maroon-800 animate-spin" />
          <span className="text-lg text-gray-600 font-medium">Loading live market data...</span>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="holdings" className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
          <p className="text-red-700 font-medium">Error loading data: {error}</p>
          <button
            onClick={fetchData}
            className="mt-4 px-6 py-2 bg-maroon-800 text-white rounded-lg hover:bg-maroon-900 transition"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="holdings" className="max-w-7xl mx-auto px-6 py-16">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8">
        <div>
          <h2 className="text-2xl font-display font-bold text-maroon-800 mb-1">
            Current Holdings
          </h2>
          <div className="gold-divider w-16 mb-4" />
        </div>
        <div className="flex items-center gap-4">
          {lastUpdated && (
            <span className="text-xs text-gray-500">
              Last updated: {new Date(lastUpdated).toLocaleTimeString()}
            </span>
          )}
          {/* View toggle */}
          <div className="flex rounded-lg border border-gray-200 overflow-hidden text-xs font-medium">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-2 transition ${viewMode === 'table' ? 'bg-maroon-800 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
              Table
            </button>
            <button
              onClick={() => setViewMode('sector')}
              className={`px-3 py-2 transition ${viewMode === 'sector' ? 'bg-maroon-800 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
              By Sector
            </button>
          </div>
          <button
            onClick={() => { setLoading(true); fetchData(); }}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-maroon-800 bg-maroon-50 hover:bg-maroon-100 rounded-lg transition border border-maroon-200"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <SummaryCard
          label="Total Holdings"
          value={holdings.length}
          icon={<div className="w-8 h-8 rounded-full bg-maroon-100 flex items-center justify-center"><span className="text-maroon-800 font-bold text-sm">#</span></div>}
        />
        <SummaryCard
          label="Gainers Today"
          value={gainers}
          icon={<div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center"><TrendingUp className="w-4 h-4 text-green-600" /></div>}
          valueColor="text-green-600"
        />
        <SummaryCard
          label="Losers Today"
          value={losers}
          icon={<div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center"><TrendingDown className="w-4 h-4 text-red-600" /></div>}
          valueColor="text-red-600"
        />
        <SummaryCard
          label="Unchanged"
          value={unchanged}
          icon={<div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><Minus className="w-4 h-4 text-gray-500" /></div>}
          valueColor="text-gray-500"
        />
      </div>

      {/* Sector Breakdown */}
      <div className="bg-white rounded-2xl shadow-sm border-2 border-gold-500 p-6 mb-8">
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-4">
          Sector Breakdown
        </h3>
        <div className="flex flex-wrap gap-3">
          {Object.entries(sectorCounts).sort((a, b) => b[1] - a[1]).map(([sector, count]) => (
            <button
              key={sector}
              onClick={() => setFilterSector(filterSector === sector ? 'All' : sector)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition border ${
                filterSector === sector
                  ? 'bg-maroon-800 text-white border-maroon-800'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-maroon-300'
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: SECTOR_COLORS[sector] || '#94a3b8' }}
              />
              {sector}
              <span className={`text-xs ${filterSector === sector ? 'text-white/70' : 'text-gray-400'}`}>
                {count}
              </span>
            </button>
          ))}
          {filterSector !== 'All' && (
            <button
              onClick={() => setFilterSector('All')}
              className="px-4 py-2 rounded-full text-sm font-medium text-maroon-800 bg-maroon-50 border border-maroon-200 hover:bg-maroon-100 transition"
            >
              Show All
            </button>
          )}
        </div>
      </div>

      {/* Holdings: Table View */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-2xl shadow-sm border-2 border-gold-500 overflow-hidden">
          <div className="px-5 py-2.5 border-b border-gray-100 flex justify-end">
            <span className="text-xs text-gray-400 italic">Click a row to view purchase history</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-maroon-800 text-white">
                  <SortHeader label="Ticker" field="ticker" current={sortField} dir={sortDir} onClick={handleSort} />
                  <SortHeader label="Company" field="name" current={sortField} dir={sortDir} onClick={handleSort} />
                  <SortHeader label="Sector" field="sector" current={sortField} dir={sortDir} onClick={handleSort} />
                  <SortHeader label="Price" field="price" current={sortField} dir={sortDir} onClick={handleSort} align="right" />
                  <SortHeader label="Change" field="change" current={sortField} dir={sortDir} onClick={handleSort} align="right" />
                  <SortHeader label="% Change" field="changePercent" current={sortField} dir={sortDir} onClick={handleSort} align="right" />
                  <SortHeader label="Day High" field="high" current={sortField} dir={sortDir} onClick={handleSort} align="right" />
                  <SortHeader label="Day Low" field="low" current={sortField} dir={sortDir} onClick={handleSort} align="right" />
                  <th className="px-3 py-3.5 w-8" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((stock, i) => (
                  <StockRow key={stock.ticker} stock={stock} i={i} onSelect={setSelectedStock} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Holdings: Sector View */}
      {viewMode === 'sector' && (
        <div className="space-y-6">
          {Object.entries(bySector)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([sector, stocks]) => {
              const sectorGainers = stocks.filter(s => s.change > 0).length;
              const sectorLosers = stocks.filter(s => s.change < 0).length;
              const color = SECTOR_COLORS[sector] || '#94a3b8';
              return (
                <div key={sector} className="bg-white rounded-2xl shadow-sm border-2 border-gold-500 overflow-hidden">
                  {/* Sector Header */}
                  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100"
                    style={{ borderLeftWidth: 4, borderLeftColor: color, borderLeftStyle: 'solid' }}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      <h3 className="font-bold text-gray-900 text-base">{sector}</h3>
                      <span className="text-xs text-gray-400 font-medium">{stocks.length} holding{stocks.length !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-medium">
                      {sectorGainers > 0 && (
                        <span className="flex items-center gap-1 text-green-600">
                          <ArrowUpRight className="w-3.5 h-3.5" />{sectorGainers} up
                        </span>
                      )}
                      {sectorLosers > 0 && (
                        <span className="flex items-center gap-1 text-red-600">
                          <ArrowDownRight className="w-3.5 h-3.5" />{sectorLosers} down
                        </span>
                      )}
                    </div>
                  </div>
                  {/* Sector Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                          <th className="px-5 py-2.5 text-left font-semibold">Ticker</th>
                          <th className="px-5 py-2.5 text-left font-semibold">Company</th>
                          <th className="px-5 py-2.5 text-right font-semibold">Price</th>
                          <th className="px-5 py-2.5 text-right font-semibold">Change</th>
                          <th className="px-5 py-2.5 text-right font-semibold">% Change</th>
                          <th className="px-5 py-2.5 text-right font-semibold">Day High</th>
                          <th className="px-5 py-2.5 text-right font-semibold">Day Low</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stocks.map((stock, i) => (
                          <StockRow key={stock.ticker} stock={stock} i={i} hideSector onSelect={setSelectedStock} />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* Stock Detail Modal */}
      <StockDetailModal stock={selectedStock} onClose={() => setSelectedStock(null)} />
    </section>
  );
}

function StockRow({ stock, i, hideSector = false, onSelect }) {
  const hasLots = !!HOLDING_LOTS[stock.ticker];
  return (
    <tr
      onClick={() => hasLots && onSelect(stock)}
      className={`border-b border-gray-50 transition-colors ${
        hasLots
          ? 'cursor-pointer hover:bg-maroon-50'
          : 'hover:bg-gold-50/30'
      } ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
    >
      <td className="px-5 py-4">
        <span className="font-bold text-maroon-800 tracking-wide">{stock.ticker}</span>
      </td>
      <td className="px-5 py-4 text-sm text-gray-700">{stock.name}</td>
      {!hideSector && (
        <td className="px-5 py-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: SECTOR_COLORS[stock.sector] || '#94a3b8' }}
            />
            {stock.sector}
          </span>
        </td>
      )}
      <td className="px-5 py-4 text-right font-mono font-semibold text-gray-900">
        ${stock.price?.toFixed(2)}
      </td>
      <td className="px-5 py-4 text-right">
        <span className={`inline-flex items-center gap-1 font-mono font-medium text-sm ${
          stock.change > 0 ? 'text-green-600' : stock.change < 0 ? 'text-red-600' : 'text-gray-500'
        }`}>
          {stock.change > 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : stock.change < 0 ? <ArrowDownRight className="w-3.5 h-3.5" /> : null}
          {stock.change > 0 ? '+' : ''}{stock.change?.toFixed(2)}
        </span>
      </td>
      <td className="px-5 py-4 text-right">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
          stock.changePercent > 0
            ? 'bg-green-50 text-green-700 ring-1 ring-green-200'
            : stock.changePercent < 0
            ? 'bg-red-50 text-red-700 ring-1 ring-red-200'
            : 'bg-gray-50 text-gray-600 ring-1 ring-gray-200'
        }`}>
          {stock.changePercent > 0 ? '+' : ''}{stock.changePercent?.toFixed(2)}%
        </span>
      </td>
      <td className="px-5 py-4 text-right font-mono text-sm text-gray-600">
        ${stock.high?.toFixed(2)}
      </td>
      <td className="px-5 py-4 text-right font-mono text-sm text-gray-600">
        ${stock.low?.toFixed(2)}
      </td>
      <td className="px-3 py-4 w-8">
        {hasLots && <ChevronRight className="w-4 h-4 text-maroon-300" />}
      </td>
    </tr>
  );
}

function SummaryCard({ label, value, icon, valueColor = 'text-maroon-800' }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border-2 border-gold-500 p-5 flex items-center gap-4">
      {icon}
      <div>
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
        <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
      </div>
    </div>
  );
}

function SortHeader({ label, field, current, dir, onClick, align = 'left' }) {
  const active = current === field;
  return (
    <th
      className={`px-5 py-3.5 text-xs font-semibold uppercase tracking-wider cursor-pointer select-none hover:bg-maroon-900 transition ${
        align === 'right' ? 'text-right' : 'text-left'
      }`}
      onClick={() => onClick(field)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {active && (
          <span className="text-gold-400">{dir === 'asc' ? '▲' : '▼'}</span>
        )}
      </span>
    </th>
  );
}
