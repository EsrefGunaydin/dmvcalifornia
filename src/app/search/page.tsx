import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import { searchEntries, categoryLabel } from '@/lib/searchIndex';

export const metadata: Metadata = {
  title: 'Search',
  robots: { index: false, follow: true },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q || '';
  const results = query.trim() ? searchEntries(query, 30) : [];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-10">
        <div className="container mx-auto px-4 max-w-2xl">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Search</h1>
          <p className="text-gray-600 mb-6">
            {query ? (
              <>
                {results.length} result{results.length === 1 ? '' : 's'} for &ldquo;{query}&rdquo;
              </>
            ) : (
              'Search practice tests, guides, and blog posts.'
            )}
          </p>

          {query && results.length === 0 && (
            <p className="text-gray-500">No results found. Try a different search term.</p>
          )}

          <ul className="space-y-3">
            {results.map((entry) => (
              <li key={entry.href}>
                <Link
                  href={entry.href}
                  className="block bg-white rounded-xl border border-gray-200 hover:border-dmv-400 hover:shadow-md transition-all p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-semibold text-gray-900">{entry.title}</span>
                    <span className="flex-shrink-0 text-[10px] font-bold uppercase tracking-wide text-primary bg-orange-100 px-2 py-1 rounded-full">
                      {categoryLabel(entry.category)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{entry.description}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <Footer />
      <CookieBanner />
    </>
  );
}
