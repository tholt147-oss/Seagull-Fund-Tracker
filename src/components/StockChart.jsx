'use client';

import { useEffect, useRef, useState } from 'react';
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';

const RANGES = ['1d', '1w', '1m', '1y', '5y'];
const RANGE_LABELS = { '1d': '1D', '1w': '1W', '1m': '1M', '1y': '1Y', '5y': '5Y' };
const INTERVAL_LABEL = {
  '1d': '5-min intervals',
  '1w': '15-min intervals',
  '1m': '1-hour intervals',
  '1y': 'Daily',
  '5y': 'Weekly',
};
const MONTH_ABBR = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAY_ABBR = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function getDateParts(datetime) {
  const [datePart, timePart = '00:00:00'] = datetime.split(' ');
  const [year, month, day] = datePart.split('-').map(Number);
  const [h, m] = timePart.split(':').map(Number);
  return { year, month, day, h, m };
}

function formatTime(datetime) {
  const { h, m } = getDateParts(datetime);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
}

function formatDayTime(datetime) {
  const { year, month, day, h, m } = getDateParts(datetime);
  const dayName = DAY_ABBR[new Date(year, month - 1, day).getDay()];
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${dayName} ${h12}:${String(m).padStart(2, '0')} ${ampm}`;
}

function formatXTick(datetime, range) {
  if (!datetime) return '';
  const { year, month, day } = getDateParts(datetime);
  switch (range) {
    case '1d': return formatTime(datetime);
    case '1w': return formatDayTime(datetime);
    case '1m': return `${MONTH_ABBR[month - 1]} ${day}`;
    case '1y': return MONTH_ABBR[month - 1];
    case '5y': return String(year);
    default:   return datetime;
  }
}

function isToday(datetime) {
  if (!datetime) return false;
  const etNow = new Date().toLocaleDateString('en-US', { timeZone: 'America/New_York' });
  const [datePart] = datetime.split(' ');
  const [year, month, day] = datePart.split('-');
  return etNow === new Date(Number(year), Number(month) - 1, Number(day))
    .toLocaleDateString('en-US', { timeZone: 'America/New_York' });
}

function getSectionTitle(range, tradingToday) {
  switch (range) {
    case '1d': return tradingToday ? "Today's Movement" : 'Last Trading Day';
    case '1w': return 'Past Week';
    case '1m': return 'Past Month';
    case '1y': return 'Past Year';
    case '5y': return '5-Year History';
    default:   return 'Performance';
  }
}

function computeXTicks(values, range) {
  if (!values.length) return [];
  switch (range) {
    case '1d':
      return values.filter((_, i) => i % 4 === 0).map(v => v.datetime);
    case '1w': {
      const seen = new Set();
      return values.reduce((acc, v) => {
        const [d] = v.datetime.split(' ');
        if (!seen.has(d)) { seen.add(d); acc.push(v.datetime); }
        return acc;
      }, []);
    }
    case '1m':
      return values.filter((_, i) => i % 8 === 0).map(v => v.datetime);
    case '1y': {
      const first = getDateParts(values[0].datetime);
      const last = getDateParts(values[values.length - 1].datetime);
      const totalMonths = (last.year - first.year) * 12 + (last.month - first.month);
      const step = totalMonths > 6 ? 2 : 1;
      const seen = new Set();
      const ticks = [];
      let count = 0;
      values.forEach(v => {
        const { year, month } = getDateParts(v.datetime);
        const key = `${year}-${month}`;
        if (!seen.has(key)) {
          seen.add(key);
          if (count % step === 0) ticks.push(v.datetime);
          count++;
        }
      });
      return ticks;
    }
    case '5y': {
      const seen = new Set();
      return values.reduce((acc, v) => {
        const { year } = getDateParts(v.datetime);
        if (!seen.has(year)) { seen.add(year); acc.push(v.datetime); }
        return acc;
      }, []);
    }
    default:
      return values.filter((_, i) => i % 4 === 0).map(v => v.datetime);
  }
}

function normalize(values) {
  if (!values.length) return [];
  const first = values[0].close;
  return values.map(v => ({
    ...v,
    pct: first !== 0 ? ((v.close - first) / first) * 100 : 0,
  }));
}

function buildChartData(tickerValues, spyValues, showBenchmark) {
  if (!showBenchmark || !spyValues?.length) return tickerValues;
  const normTicker = normalize(tickerValues);
  const normSpy = normalize(spyValues);
  const spyMap = new Map(normSpy.map(v => [v.datetime, v.pct]));
  return normTicker.map(v => ({ ...v, spyPct: spyMap.get(v.datetime) ?? null }));
}

function CustomTooltip({ active, payload, previousClose, range, showBenchmark, ticker }) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;
  const label = formatXTick(d.datetime, range);

  if (showBenchmark) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2 text-xs">
        <p className="text-gray-500 mb-1">{label}</p>
        <p className={`font-bold ${(d.pct ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {ticker}: {(d.pct ?? 0) >= 0 ? '+' : ''}{(d.pct ?? 0).toFixed(2)}%
        </p>
        {d.spyPct != null && (
          <p className="font-semibold text-gray-500">
            S&P 500: {d.spyPct >= 0 ? '+' : ''}{d.spyPct.toFixed(2)}%
          </p>
        )}
      </div>
    );
  }

  const price = d.close;
  const diff = range === '1d' && previousClose != null ? price - previousClose : null;
  const pct = diff != null && previousClose ? (diff / previousClose) * 100 : null;
  const up = diff == null || diff >= 0;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2 text-xs">
      <p className="text-gray-500 mb-1">{label}</p>
      <p className="font-bold font-mono text-gray-900">${price.toFixed(2)}</p>
      {diff != null && (
        <p className={`font-semibold ${up ? 'text-green-600' : 'text-red-600'}`}>
          {up ? '+' : ''}{diff.toFixed(2)} ({up ? '+' : ''}{pct.toFixed(2)}%)
        </p>
      )}
    </div>
  );
}

export default function StockChart({ ticker, currentPrice, previousClose }) {
  const [range, setRange] = useState('1d');
  const [showBenchmark, setShowBenchmark] = useState(false);
  const [data, setData] = useState(null);
  const [spyData, setSpyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [switching, setSwitching] = useState(false);
  const [error, setError] = useState(null);
  const prevTickerRef = useRef(null);

  useEffect(() => {
    if (!ticker) return;

    const isNewTicker = prevTickerRef.current !== ticker;
    prevTickerRef.current = ticker;
    setError(null);

    if (isNewTicker) {
      setData(null);
      setSpyData(null);
      setLoading(true);
      setSwitching(false);
    } else {
      setSwitching(true);
    }

    const spyFetch = showBenchmark
      ? fetch(`/api/chart?symbol=SPY&range=${range}`).then(r => r.json())
      : Promise.resolve(null);

    Promise.all([
      fetch(`/api/chart?symbol=${encodeURIComponent(ticker)}&range=${range}`).then(r => r.json()),
      spyFetch,
    ])
      .then(([tickerJson, spyJson]) => {
        if (tickerJson.rateLimited) {
          setError('Rate limit reached — try again in a moment');
          return;
        }
        if (tickerJson.error) {
          setError(tickerJson.error);
          return;
        }
        if (!tickerJson.values?.length) {
          setError('No data returned');
          return;
        }
        setData(tickerJson);
        setSpyData(spyJson && !spyJson.error ? spyJson : null);
      })
      .catch(err => setError(err.message || 'Network error'))
      .finally(() => {
        setLoading(false);
        setSwitching(false);
      });
  }, [ticker, range, showBenchmark]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[320px] text-sm text-gray-400 animate-pulse">
        Loading chart data…
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="flex flex-col items-center justify-center h-[320px] gap-2">
        <p className="text-sm text-gray-400">{error}</p>
      </div>
    );
  }

  const values = data?.values ?? [];
  const spyValues = spyData?.values ?? [];
  const chartData = buildChartData(values, spyValues, showBenchmark);

  const lastPoint = values[values.length - 1];
  const firstClose = values[0]?.close;
  const lastClose = lastPoint?.close ?? currentPrice;
  const tradingToday = isToday(lastPoint?.datetime);
  const subtitle = getSectionTitle(range, tradingToday);

  const isUp = range === '1d'
    ? (previousClose == null || lastClose >= previousClose)
    : (firstClose == null || lastClose >= firstClose);

  const lineColor = isUp ? '#16a34a' : '#dc2626';
  const gradientId = `chartGradient-${ticker}`;

  const xTicks = computeXTicks(values, range);

  const yDomain = (() => {
    if (showBenchmark && chartData.length) {
      const allPcts = chartData.flatMap(d => [d.pct, d.spyPct].filter(v => v != null));
      if (allPcts.length) {
        const min = Math.min(...allPcts);
        const max = Math.max(...allPcts);
        const pad = (max - min) * 0.15 || 0.5;
        return [min - pad, max + pad];
      }
    }
    const closes = values.map(v => v.close);
    const min = Math.min(...closes);
    const max = Math.max(...closes);
    const pad = (max - min) * 0.15 || 0.5;
    return [min - pad, max + pad];
  })();

  const yFormatter = showBenchmark
    ? v => `${v >= 0 ? '+' : ''}${v.toFixed(1)}%`
    : v => `$${v.toFixed(2)}`;

  return (
    <div>
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-sm font-bold text-maroon-800">{ticker}</span>
          <span className="text-xs text-gray-400 ml-2">{subtitle}</span>
        </div>
        <span className="text-xs text-gray-400">
          {values.length} pts &middot; {INTERVAL_LABEL[range]}
        </span>
      </div>

      {/* Timeframe pills */}
      <div className="flex items-center gap-3 mb-3">
        <div className="inline-flex items-center bg-gray-100 rounded-full p-0.5 gap-0.5">
          {RANGES.map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                range === r
                  ? 'bg-maroon-800 text-white'
                  : 'bg-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {RANGE_LABELS[r]}
            </button>
          ))}
        </div>
      </div>

      {/* Benchmark toggle */}
      <div className="flex items-center gap-2 mb-4">
        <button
          role="checkbox"
          aria-checked={showBenchmark}
          onClick={() => setShowBenchmark(v => !v)}
          className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
            showBenchmark ? 'bg-maroon-800' : 'bg-gray-300'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-3 w-3 rounded-full bg-white shadow transform transition-transform ${
              showBenchmark ? 'translate-x-3' : 'translate-x-0'
            }`}
          />
        </button>
        <span className="text-xs text-gray-600 select-none">Compare to S&P 500</span>
      </div>

      {/* Chart area (with switching overlay) */}
      <div className="relative">
        {switching && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/60 rounded-lg">
            <div className="w-5 h-5 border-2 border-maroon-800 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && data && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/80 rounded-lg">
            <p className="text-sm text-gray-500">{error}</p>
          </div>
        )}

        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={chartData} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={lineColor} stopOpacity={0.3} />
                <stop offset="100%" stopColor={lineColor} stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />

            <XAxis
              dataKey="datetime"
              ticks={xTicks}
              tickFormatter={v => formatXTick(v, range)}
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              domain={yDomain}
              tickFormatter={yFormatter}
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
              width={showBenchmark ? 55 : 62}
            />

            {range === '1d' && previousClose != null && !showBenchmark && (
              <ReferenceLine
                y={previousClose}
                stroke="#9ca3af"
                strokeDasharray="4 3"
                label={{ value: 'Prev Close', position: 'insideTopRight', fontSize: 10, fill: '#9ca3af' }}
              />
            )}

            <Tooltip
              content={
                <CustomTooltip
                  previousClose={previousClose}
                  range={range}
                  showBenchmark={showBenchmark}
                  ticker={ticker}
                />
              }
            />

            <Area
              type="monotone"
              dataKey={showBenchmark ? 'pct' : 'close'}
              stroke={lineColor}
              strokeWidth={2}
              fill={`url(#${gradientId})`}
              dot={false}
              activeDot={{ r: 4, fill: lineColor, strokeWidth: 0 }}
            />

            {showBenchmark && spyData && (
              <Line
                type="monotone"
                dataKey="spyPct"
                stroke="#9ca3af"
                strokeWidth={1.5}
                strokeDasharray="5 3"
                dot={false}
                activeDot={false}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Legend (benchmark mode only) */}
      {showBenchmark && (
        <div className="flex items-center gap-4 mt-2 justify-center">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-0.5 rounded" style={{ backgroundColor: lineColor }} />
            <span className="text-xs text-gray-600">{ticker}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg width="24" height="4" className="shrink-0">
              <line x1="0" y1="2" x2="24" y2="2" stroke="#9ca3af" strokeWidth="1.5" strokeDasharray="5 3" />
            </svg>
            <span className="text-xs text-gray-600">S&P 500</span>
          </div>
        </div>
      )}
    </div>
  );
}
