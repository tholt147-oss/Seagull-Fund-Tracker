'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-maroon-800 text-white">
      {/* Top accent bar */}
      <div className="h-1.5 bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500" />

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          {/* Logo + Title */}
          <Link href="/" className="flex items-center gap-5 hover:opacity-90 transition-opacity">
            <img
              src="/logo.png"
              alt="Sea Gull Fund Logo"
              className="w-20 h-20 rounded-full border-2 border-gold-500 shadow-lg bg-white p-1"
            />
            <div>
              <h1 className="text-3xl font-display font-bold tracking-tight">
                Sea Gull Fund
              </h1>
              <p className="text-gold-400 text-sm font-medium tracking-wide uppercase mt-0.5">
                Salisbury University &middot; Perdue School of Business
              </p>
            </div>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-10">
            <a
              href="/#holdings"
              className="relative text-base font-bold text-white hover:text-gold-400 transition-colors after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:w-0 after:bg-gold-500 after:transition-all hover:after:w-full"
            >
              Holdings
            </a>
            <Link
              href="/news"
              className="relative text-base font-bold text-white hover:text-gold-400 transition-colors after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:w-0 after:bg-gold-500 after:transition-all hover:after:w-full"
            >
              News
            </Link>
            <Link
              href="/history"
              className="relative text-base font-bold text-white hover:text-gold-400 transition-colors after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:w-0 after:bg-gold-500 after:transition-all hover:after:w-full"
            >
              History
            </Link>
            <div className="flex items-center gap-2 bg-maroon-900/60 px-4 py-2 rounded-full border border-gold-500/30">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-gold-400 font-medium">LIVE DATA</span>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
