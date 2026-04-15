import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { NEWS_ITEMS } from '../../data/news';
import { Newspaper, Calendar, Tag } from 'lucide-react';

export const metadata = {
  title: 'News & Updates | Sea Gull Fund',
  description:
    'Latest news, meeting consensus summaries, and announcements from the Sea Gull Fund.',
};

const CATEGORY_STYLES = {
  'Meeting Consensus': 'bg-maroon-800 text-white',
  'Portfolio Update':  'bg-gold-500 text-maroon-900',
  'Fund News':         'bg-blue-100 text-blue-900',
  'Announcement':      'bg-green-100 text-green-900',
};

function formatDate(dateStr) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });
}

function CategoryPill({ category }) {
  const cls = CATEGORY_STYLES[category] ?? 'bg-gray-100 text-gray-700';
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${cls}`}>
      <Tag className="w-3 h-3" />
      {category}
    </span>
  );
}

function NewsCard({ item }) {
  const paragraphs = item.body ? item.body.split('\n\n') : [];

  return (
    <article className="bg-white rounded-2xl border-2 border-gold-500 shadow-sm p-8">
      {/* Meta row */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <CategoryPill category={item.category} />
        <span className="flex items-center gap-1.5 text-sm text-gray-400">
          <Calendar className="w-3.5 h-3.5" />
          {formatDate(item.date)}
        </span>
      </div>

      {/* Title */}
      <h2 className="text-xl font-display font-bold text-maroon-800 mt-4">{item.title}</h2>

      {/* Summary */}
      {item.summary && (
        <p className="text-gray-600 mt-2">{item.summary}</p>
      )}

      {/* Body */}
      {paragraphs.length > 0 && (
        <div className="mt-4 space-y-3">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-gray-700 leading-relaxed">{p}</p>
          ))}
        </div>
      )}

      {/* Ticker pills */}
      {item.tickers?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-5">
          {item.tickers.map(ticker => (
            <span
              key={ticker}
              className="px-2.5 py-1 bg-gray-100 text-gray-700 font-mono text-xs rounded-full"
            >
              {ticker}
            </span>
          ))}
        </div>
      )}

      {/* Author */}
      {item.author && (
        <p className="mt-5 text-sm italic text-gray-400">— {item.author}</p>
      )}
    </article>
  );
}

function EmptyState() {
  return (
    <div className="bg-white rounded-2xl border-2 border-gold-500 shadow-sm p-12 text-center">
      <div className="h-px w-16 bg-gold-500 rounded mx-auto mb-8" />
      <div className="flex justify-center mb-6">
        <Newspaper className="w-16 h-16 text-gold-500" strokeWidth={1.25} />
      </div>
      <h2 className="text-2xl font-display font-bold text-maroon-800 mb-3">No Updates Yet</h2>
      <p className="text-gray-500 leading-relaxed max-w-md mx-auto">
        Check back soon — fund news, meeting summaries, and committee decisions will be
        posted here as they happen.
      </p>
      <div className="h-px w-16 bg-gold-500 rounded mx-auto mt-8" />
    </div>
  );
}

export default function NewsPage() {
  const sorted = [...NEWS_ITEMS].sort((a, b) => new Date(b.date) - new Date(a.date));

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
            News &amp; Updates
          </h1>
          <p className="text-xl text-white/70 font-light max-w-2xl mx-auto">
            Meeting consensus summaries, portfolio updates, and announcements from the Sea Gull Fund
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        {sorted.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-6">
            {sorted.map(item => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
