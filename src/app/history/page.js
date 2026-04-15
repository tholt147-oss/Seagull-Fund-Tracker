import Header from '../../components/Header';
import Footer from '../../components/Footer';
import InvestmentGuidelines from '../../components/InvestmentGuidelines';
import { Calendar, BookOpen, Target, Shield, Phone } from 'lucide-react';

export const metadata = {
  title: 'History & Charter | Sea Gull Fund',
  description:
    'The Sea Gull Fund was founded in Fall 2000 at Salisbury University\'s Perdue School of Business — one of the few entirely undergraduate-managed investment funds in the University System of Maryland. Learn about its charter, investment guidelines, and 25-year history.',
};

function SectionHeading({ icon: Icon, children }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-1">
        {Icon && <Icon className="w-5 h-5 text-maroon-800" />}
        <h2 className="text-2xl font-display font-bold text-maroon-800">{children}</h2>
      </div>
      <div className="gold-divider w-16" />
    </div>
  );
}

export default function HistoryPage() {
  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-maroon-800 via-maroon-900 to-maroon-950 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-20 w-64 h-64 rounded-full bg-gold-400 blur-3xl" />
          <div className="absolute bottom-0 left-10 w-96 h-96 rounded-full bg-gold-500 blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 py-20 text-center">
          <p className="text-gold-400 text-sm font-medium uppercase tracking-[0.25em] mb-4">
            Salisbury University &middot; Perdue School of Business
          </p>
          <h1 className="text-5xl md:text-6xl font-display font-bold tracking-tight mb-4">
            History &amp; Charter
          </h1>
          <p className="text-xl text-white/70 font-light max-w-2xl mx-auto">
            A quarter-century of student-led investment management
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-16 space-y-20">

        {/* Section 1: Origins */}
        <section>
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <SectionHeading icon={Calendar}>Origins</SectionHeading>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  The Sea Gull Fund was established in <strong>Fall 2000</strong> as part of the Perdue School of Business, making it one of the first student-managed investment portfolios operated exclusively by undergraduate students within the University System of Maryland.
                </p>
                <p>
                  The fund was created within the Perdue School's broader{' '}
                  <strong>Applied Business Learning Experience (ABLE)</strong> program — an initiative that has positioned Salisbury University as a widely recognized regional leader in experiential business education.
                </p>
                <p>
                  Approximately <strong>200 student-managed funds</strong> exist nationwide. The Sea Gull Fund is one of the few led entirely by undergraduates, offering participants a rare level of ownership and responsibility over a real institutional portfolio.
                </p>
              </div>
            </div>

            {/* Key Facts card */}
            <div className="bg-white rounded-2xl shadow-sm border-2 border-gold-500 p-8">
              <h3 className="text-lg font-display font-bold text-maroon-800 mb-6">Key Facts</h3>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { label: 'Founded', value: 'Fall 2000' },
                  { label: 'Course', value: 'FINA 449' },
                  { label: 'Class Size', value: 'Limited to 20' },
                  { label: 'Funding Type', value: '100% Private' },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">{label}</p>
                    <p className="text-lg font-bold text-maroon-800 mt-0.5">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: 25th Anniversary */}
        <section>
          <div className="bg-maroon-800 rounded-2xl shadow-lg p-8 md:p-10 flex flex-col md:flex-row items-center gap-8">
            <img
              src="/logo.png"
              alt="Sea Gull Fund Logo"
              className="w-24 h-24 rounded-full border-2 border-gold-500 bg-white p-1 shadow-lg shrink-0"
            />
            <div>
              <p className="text-gold-400 text-xs font-semibold uppercase tracking-widest mb-2">Milestone</p>
              <h2 className="text-3xl font-display font-bold text-white mb-3">Celebrating 25 Years</h2>
              <p className="text-white/80 leading-relaxed">
                On <strong className="text-gold-400">December 12, 2025</strong>, the Sea Gull Fund marked its 25th anniversary at the Perdue School Auditorium — recognizing two and a half decades of student analysts, faculty mentors, and donor support that have shaped one of Maryland's most distinctive undergraduate finance programs.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Funding */}
        <section>
          <SectionHeading icon={Shield}>Funding</SectionHeading>
          <div className="bg-white rounded-2xl shadow-sm border-2 border-gold-500 p-8">
            <p className="text-gray-700 leading-relaxed mb-6">
              The Sea Gull Fund is <strong>100% privately funded</strong> — no student tuition or university operating dollars are used. The portfolio has been built and sustained through the generosity of the following contributors:
            </p>
            <div className="flex flex-wrap gap-3">
              {[
                'The Judkins Family',
                'Perdue School Margin Account Funds',
                'SU Foundation Investment Account Funds',
              ].map(donor => (
                <span
                  key={donor}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-maroon-50 text-maroon-800 rounded-full text-sm font-semibold border border-maroon-200"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />
                  {donor}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Section 4: The Course */}
        <section>
          <SectionHeading icon={BookOpen}>The Course — FINA 449</SectionHeading>
          <div className="bg-white rounded-2xl shadow-sm border-2 border-gold-500 p-8 space-y-6">
            <div>
              <h3 className="text-base font-bold text-gray-900 mb-1">Practicum in Portfolio Management</h3>
              <p className="text-sm text-gray-500">3 credits &middot; Offered every Fall and Spring since Fall 2000 &middot; Staffed by Finance faculty</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">Admission</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-maroon-800 shrink-0" />Enrollment limited to 20 students</li>
                  <li className="flex items-start gap-2"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-maroon-800 shrink-0" />Application-based; reviewed by the Department Chair and course instructor</li>
                  <li className="flex items-start gap-2"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-maroon-800 shrink-0" />Students may repeat the course for credit to maintain portfolio continuity</li>
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">Responsibilities</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  {[
                    'Designing long-term investment strategy',
                    'Preparing and presenting security research reports',
                    'Executing investment decisions',
                    'Monitoring portfolio performance and compliance',
                    'Record keeping and performance evaluation',
                    'Presenting to the Economics and Finance Advisory Council',
                  ].map(r => (
                    <li key={r} className="flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold-500 shrink-0" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Investment Policy Statement */}
        <section>
          <SectionHeading icon={Target}>Investment Policy Statement</SectionHeading>
          <div className="bg-white rounded-2xl shadow-sm border-2 border-gold-500 divide-y divide-gray-100">
            {[
              {
                label: 'Goal',
                value: 'Strategic core-oriented allocation to the overall domestic equity market.',
              },
              {
                label: 'Objective',
                value: 'Long-term capital growth through marketable U.S. equities with a risk profile similar to the S&P 500 Index.',
              },
              {
                label: 'Performance Target',
                value: 'Generate total return in excess of the S&P 500 benchmark over 1-year, 3-year, and 5-year periods.',
              },
            ].map(({ label, value }) => (
              <div key={label} className="flex flex-col sm:flex-row sm:items-center gap-2 px-8 py-5">
                <span className="w-40 shrink-0 text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</span>
                <p className="text-gray-800 text-sm leading-relaxed">{value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 6: Investment Guidelines (client accordion) */}
        <section>
          <SectionHeading icon={Shield}>Investment Guidelines</SectionHeading>
          <InvestmentGuidelines />
        </section>

        {/* Section 7: Faculty Contact */}
        <section>
          <SectionHeading icon={Phone}>Faculty Contact</SectionHeading>
          <div className="bg-white rounded-2xl shadow-sm border-2 border-gold-500 p-8 flex flex-col sm:flex-row sm:items-center gap-6 max-w-lg">
            <div className="w-14 h-14 rounded-full bg-maroon-100 flex items-center justify-center shrink-0">
              <span className="text-maroon-800 font-bold text-xl">JG</span>
            </div>
            <div className="space-y-1">
              <p className="font-bold text-gray-900">Jodie Gallons</p>
              <p className="text-sm text-gray-500">Department of Finance, Perdue Hall (PH) 229</p>
              <p className="text-sm text-gray-600">
                <a href="tel:4106774808" className="hover:text-maroon-800 transition-colors">410-677-4808</a>
              </p>
              <p className="text-sm text-gray-600">
                <a href="mailto:jagallons@salisbury.edu" className="hover:text-maroon-800 transition-colors text-maroon-700 font-medium">
                  jagallons@salisbury.edu
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* Section 8: Source attribution */}
        <p className="text-xs text-gray-400 text-center pb-4">
          Information sourced from{' '}
          <a
            href="https://www.salisbury.edu/academic-offices/business/finance/seagull-fund.aspx"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-maroon-800 transition-colors"
          >
            Salisbury University&apos;s official Sea Gull Fund page
          </a>
          .
        </p>

      </div>

      <Footer />
    </main>
  );
}
