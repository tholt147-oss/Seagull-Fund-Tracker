import Link from 'next/link';
import Header from '../components/Header';
import HoldingsTable from '../components/HoldingsTable';
import SectorAllocation from '../components/SectorAllocation';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-maroon-800 via-maroon-900 to-maroon-950 text-white overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-20 w-64 h-64 rounded-full bg-gold-400 blur-3xl" />
          <div className="absolute bottom-0 left-10 w-96 h-96 rounded-full bg-gold-500 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20 text-center">
          <p className="text-gold-400 text-sm font-medium uppercase tracking-[0.25em] mb-4">
            Salisbury University &middot; Perdue School of Business
          </p>
          <h2 className="text-5xl md:text-6xl font-display font-bold tracking-tight mb-4">
            Sea Gull Fund
          </h2>
          <p className="text-xl text-white/70 font-light max-w-2xl mx-auto mb-8">
            A student-managed investment portfolio with over{' '}
            <span className="text-gold-400 font-semibold">$2.5 million</span>{' '}
            in assets under management
          </p>
          <div className="flex justify-center">
            <a
              href="#holdings"
              className="px-8 py-3 bg-gold-500 text-maroon-900 font-bold rounded-lg hover:bg-gold-400 transition shadow-lg shadow-gold-500/20"
            >
              View Holdings
            </a>
          </div>
        </div>
      </section>

      {/* Fund Overview */}
      <section className="bg-stone-50 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-display font-bold text-maroon-800 mb-3">About the Fund</h2>
          <div className="h-1 w-16 bg-gold-500 rounded mb-8" />
          <p className="text-base text-gray-700 leading-relaxed max-w-3xl mb-6">
            The Sea Gull Fund is a student-managed investment portfolio housed within Salisbury
            University's Perdue School of Business, with over $2.5 million in assets under
            management. Established in 2000, it is the first investment portfolio directed
            exclusively by undergraduate students within the University System of Maryland.
            Student analysts are competitively selected, trained in fundamental equity research
            and portfolio management, and tasked with evaluating current holdings, building
            financial models, and pitching new investment ideas to the fund's investment committee.
          </p>
          <Link href="/history" className="text-maroon-800 font-semibold hover:text-gold-600 transition-colors">
            Read the full history &amp; charter →
          </Link>
        </div>
      </section>

      <HoldingsTable />
      <SectorAllocation />
      <Footer />
    </main>
  );
}
