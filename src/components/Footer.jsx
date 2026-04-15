'use client';

export default function Footer() {
  return (
    <footer className="bg-maroon-800 text-white mt-16">
      <div className="gold-divider" />
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Disclaimer */}
          <div className="max-w-2xl">
            <p className="text-xs text-white/50 leading-relaxed">
              <span className="font-semibold text-white/70">Disclaimer:</span>{' '}
              The Sea Gull Fund is a student-managed portfolio for educational purposes.
              The information presented on this site is not intended as investment advice.
              Past performance does not guarantee future results. All market data is
              provided by Finnhub and may be subject to delay.
            </p>
          </div>

          {/* Student Credit */}
          <div className="text-right shrink-0">
            <p className="text-xs text-white/40 uppercase tracking-wider font-medium mb-1">
              Student-Produced Website
            </p>
            <p className="text-sm font-semibold text-gold-400">
              Timothy Holt
            </p>
            <p className="text-xs text-white/50 mt-0.5">
              Perdue School of Business &middot; Class of 2026
            </p>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} Sea Gull Fund &middot; Salisbury University
          </p>
          <p className="text-xs text-white/40">
            Market data provided by{' '}
            <a
              href="https://finnhub.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-400/70 hover:text-gold-400 transition"
            >
              Finnhub
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
