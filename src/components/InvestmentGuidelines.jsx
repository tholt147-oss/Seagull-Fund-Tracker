'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const GUIDELINES = [
  {
    title: 'Asset Allocation',
    content: (
      <p className="text-gray-700 leading-relaxed text-sm">
        The portfolio is invested exclusively in U.S. listed equity securities, including those listed on NASDAQ.
        Cash equivalents represent transactional amounts only and <strong>may not exceed 5% of the portfolio at any time.</strong>{' '}
        Any deviation from this limit must be corrected by month-end.
      </p>
    ),
  },
  {
    title: 'Diversification',
    content: (
      <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
        <p>
          The portfolio is actively managed with diversified exposure across sectors, industries, and individual issues.
          Specific limits apply:
        </p>
        <ul className="list-disc list-inside space-y-1.5 pl-2">
          <li>Maximum <strong>40%</strong> per economic sector (S&P-defined)</li>
          <li>Maximum <strong>10%</strong> per single issue</li>
          <li>Minimum <strong>15 securities</strong> held at all times</li>
          <li>ADRs are permitted; combined ADR and foreign-on-US-exchange holdings capped at <strong>20%</strong></li>
          <li>Covered derivatives: unlimited</li>
          <li>Naked derivatives: VAR capped at <strong>10%</strong> of portfolio</li>
          <li>Up to <strong>10%</strong> of portfolio market value may be held in liquid funds as derivatives margin</li>
        </ul>
        <p className="text-xs text-gray-500">Violations must be corrected by quarter-end.</p>
      </div>
    ),
  },
  {
    title: 'Market Capitalization',
    content: (
      <div className="space-y-2 text-sm text-gray-700 leading-relaxed">
        <p>The majority of the portfolio is invested in established large-cap companies.</p>
        <ul className="list-disc list-inside space-y-1.5 pl-2">
          <li>No more than <strong>40%</strong> in companies with market cap below $1B</li>
          <li>Initial investment in companies under <strong>$100M market cap is prohibited</strong></li>
          <li>Positions that drift below $100M post-purchase are capped at <strong>5%</strong> of the portfolio</li>
        </ul>
      </div>
    ),
  },
  {
    title: 'Prohibited Transactions',
    content: (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
        {[
          'Fixed income securities',
          'Non-marketable securities (private debt or direct placements)',
          'Non-dollar denominated securities',
          'Convertible or Preferred securities',
          'Warrants',
          'Commodities',
          'Mutual Funds',
          'Short Sales',
          'Margin Purchases',
          'Swaps (Index or rate of return)',
          'Securities Lending',
        ].map(item => (
          <div key={item} className="flex items-start gap-2 text-sm text-gray-700">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-maroon-800 shrink-0" />
            {item}
          </div>
        ))}
      </div>
    ),
  },
  {
    title: 'Trade Execution',
    content: (
      <div className="space-y-2 text-sm text-gray-700 leading-relaxed">
        <p>All investment decisions are made by <strong>majority student vote</strong>. Students assigned to sector teams are responsible for research and recommendations; the class votes on each transaction.</p>
        <p><strong>Trading authority</strong> rests with the Department Chair of Economics and Finance and designated faculty members. The Dean and Associate Dean of the Perdue School hold trading authority for emergency situations only. <em>No students hold trading authority.</em></p>
        <p>Trades are executed at significantly discounted rates through <strong>The Hill Group at Morgan Stanley Smith Barney's Easton office.</strong></p>
      </div>
    ),
  },
  {
    title: 'Reporting',
    content: (
      <div className="space-y-2 text-sm text-gray-700 leading-relaxed">
        <p>Student managers, under faculty supervision, prepare <strong>monthly account statements</strong> and reconcile broker statements. Reports are distributed to the Dean of the Perdue School and the Executive Director of the SU Foundation.</p>
        <p>Each semester, student managers <strong>present portfolio status and activities</strong> to the Economics and Finance Advisory Council.</p>
      </div>
    ),
  },
];

export default function InvestmentGuidelines() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="space-y-2">
      {GUIDELINES.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={item.title}
            className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(isOpen ? -1 : i)}
              className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
            >
              <span className="font-semibold text-gray-900 text-sm">{item.title}</span>
              <ChevronDown
                className={`w-4 h-4 text-maroon-800 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {isOpen && (
              <div className="px-6 pb-5 pt-1 border-t border-gray-100">
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
