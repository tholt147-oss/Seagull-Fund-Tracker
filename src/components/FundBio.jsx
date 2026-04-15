'use client';

export default function FundBio() {
  return (
    <section id="about" className="max-w-7xl mx-auto px-6 py-16">
      <div className="grid md:grid-cols-2 gap-12 items-start">
        {/* About the Fund */}
        <div>
          <h2 className="text-2xl font-display font-bold text-maroon-800 mb-1">
            About the Fund
          </h2>
          <div className="gold-divider w-16 mb-6" />
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              The Sea Gull Fund is a student-managed investment portfolio housed within
              Salisbury University&apos;s Perdue School of Business. With over{' '}
              <span className="font-semibold text-maroon-800">$2.5 million in assets under management</span>,
              the fund provides students with hands-on experience in equity research,
              portfolio management, and institutional-level investment decision making.
            </p>
            <p>
              Students are competitively selected into the program based on academic
              performance, demonstrated interest in capital markets, and analytical ability.
              Once admitted, analysts undergo rigorous training in financial modeling,
              discounted cash flow analysis, relative valuation, and Bloomberg Terminal
              proficiency before being assigned to sector coverage teams.
            </p>
            <p>
              Each analyst is responsible for evaluating current portfolio holdings,
              building detailed financial models, and presenting actionable buy, sell,
              or hold recommendations to the fund&apos;s investment committee. Analysts
              also source and pitch new investment ideas — identifying stocks with
              compelling risk-adjusted upside potential that align with the fund&apos;s
              mandate and investment philosophy.
            </p>
          </div>
        </div>

        {/* Key Stats */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8">
            <h3 className="text-lg font-display font-bold text-maroon-800 mb-6">
              Fund Overview
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <Stat label="Assets Under Management" value="$2.5M+" />
              <Stat label="Established" value="2001" />
              <Stat label="Current Holdings" value="28" />
              <Stat label="University" value="Salisbury" />
              <Stat label="School" value="Perdue School of Business" />
              <Stat label="Structure" value="Student-Managed" />
            </div>
          </div>

          <div className="bg-maroon-800 rounded-2xl shadow-md p-8 text-white">
            <h3 className="text-lg font-display font-bold text-gold-400 mb-3">
              Investment Philosophy
            </h3>
            <p className="text-white/85 text-sm leading-relaxed">
              The Sea Gull Fund follows a fundamental, bottom-up approach to equity
              selection. We seek high-quality businesses with durable competitive
              advantages, strong free cash flow generation, and management teams
              aligned with shareholder interests — purchased at reasonable valuations
              relative to intrinsic value.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">{label}</p>
      <p className="text-lg font-bold text-maroon-800 mt-0.5">{value}</p>
    </div>
  );
}
