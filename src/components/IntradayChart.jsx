'use client';

import { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  defs,
  linearGradient,
  stop,
} from 'recharts';

// Format "2026-04-15 09:30:00" → "9:30 AM"
function formatTime(datetime) {
  if (!datetime) return '';
  const [, timePart] = datetime.split(' ');
  const [hStr, mStr] = timePart.split(':');
  const h = parseInt(hStr, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${mStr} ${ampm}`;
}

// Returns true if the most recent data point is from today (Eastern Time)
function isToday(datetime) {
  if (!datetime) return false;
  const etNow = new Date().toLocaleDateString('en-US', { timeZone: 'America/New_York' });
  const [datePart] = datetime.split(' ');
  const [year, month, day] = datePart.split('-');
  const dataDate = new Date(Number(year), Number(month) - 1, Number(day))
    .toLocaleDateString('en-US', { timeZone: 'America/New_York' });
  return etNow === dataDate;
}

function CustomTooltip({ active, payload, previousClose }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const price = d.close;
  const diff = previousClose != null ? price - previousClose : null;
  const pct = previousClose ? (diff / previousClose) * 100 : null;
  const up = diff == null || diff >= 0;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2 text-xs">
      <p className="text-gray-500 mb-1">{formatTime(d.datetime)}</p>
      <p className="font-bold font-mono text-gray-900">${price.toFixed(2)}</p>
      {diff != null && (
        <p className={`font-semibold ${up ? 'text-green-600' : 'text-red-600'}`}>
          {up ? '+' : ''}{diff.toFixed(2)} ({up ? '+' : ''}{pct.toFixed(2)}%)
        </p>
      )}
    </div>
  );
}

export default function IntradayChart({ ticker, currentPrice, previousClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorDetail, setErrorDetail] = useState(null);

  useEffect(() => {
    if (!ticker) return;
    setLoading(true);
    setError(false);
    setErrorDetail(null);
    setData(null);

    fetch(`/api/intraday?symbol=${encodeURIComponent(ticker)}`)
      .then(async res => {
        const json = await res.json();
        if (!res.ok) {
          setErrorDetail(json.error || json.message || `HTTP ${res.status}`);
          setError(true);
          return;
        }
        if (json.error) {
          setErrorDetail(json.error);
          setError(true);
          return;
        }
        if (!json.values?.length) {
          setErrorDetail('API returned no data points');
          setError(true);
          return;
        }
        setData(json);
      })
      .catch(err => {
        setErrorDetail(err.message || 'Network error');
        setError(true);
      })
      .finally(() => setLoading(false));
  }, [ticker]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[280px] text-sm text-gray-400 animate-pulse">
        Loading intraday data…
      </div>
    );
  }

  if (error || !data?.values?.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[280px] gap-2">
        <p className="text-sm text-gray-400">Intraday data unavailable for this ticker.</p>
        {errorDetail && (
          <p className="text-xs text-gray-400 font-mono bg-gray-50 px-3 py-1.5 rounded border border-gray-200">
            Debug: {errorDetail}
          </p>
        )}
      </div>
    );
  }

  const values = data.values;
  const lastPoint = values[values.length - 1];
  const lastClose = lastPoint?.close ?? currentPrice;
  const tradingToday = isToday(lastPoint?.datetime);
  const subtitle = tradingToday ? "Today's Movement" : 'Last Trading Day';

  // Dynamic color: green if last close >= previous close, red if below
  const isUp = previousClose == null || lastClose >= previousClose;
  const lineColor = isUp ? '#16a34a' : '#dc2626';
  const gradientId = `intradayGradient-${ticker}`;

  // Y-axis domain: focus on the day's range with small padding
  const closes = values.map(v => v.close);
  const minClose = Math.min(...closes);
  const maxClose = Math.max(...closes);
  const padding = (maxClose - minClose) * 0.15 || 0.5;
  const yDomain = [minClose - padding, maxClose + padding];

  // X-axis: show only every 4th tick
  const xTicks = values
    .filter((_, i) => i % 4 === 0)
    .map(v => v.datetime);

  return (
    <div>
      {/* Chart header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-sm font-bold text-maroon-800">{ticker}</span>
          <span className="text-xs text-gray-400 ml-2">{subtitle}</span>
        </div>
        <span className="text-xs text-gray-400">{values.length} data points &middot; 5-min intervals</span>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={values} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
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
            tickFormatter={formatTime}
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            domain={yDomain}
            tickFormatter={v => `$${v.toFixed(2)}`}
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            axisLine={false}
            tickLine={false}
            width={62}
          />

          {previousClose != null && (
            <ReferenceLine
              y={previousClose}
              stroke="#9ca3af"
              strokeDasharray="4 3"
              label={{ value: 'Prev Close', position: 'insideTopRight', fontSize: 10, fill: '#9ca3af' }}
            />
          )}

          <Tooltip content={<CustomTooltip previousClose={previousClose} />} />

          <Area
            type="monotone"
            dataKey="close"
            stroke={lineColor}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            dot={false}
            activeDot={{ r: 4, fill: lineColor, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
