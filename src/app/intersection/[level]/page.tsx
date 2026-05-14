import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import AppPromotion from '@/components/AppPromotion';
import MultiplexAd from '@/components/MultiplexAd';
import IntersectionGame from '@/components/games/IntersectionGame';
import levelsData from '@/data/intersection-levels.json';
import { IntersectionLevel } from '@/types/intersection';

const SITE_URL = 'https://www.dmvcalifornia.us';
const levels = levelsData.levels as unknown as IntersectionLevel[];

export function generateStaticParams() {
  return levels.map((lvl) => ({ level: lvl.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ level: string }>;
}): Promise<Metadata> {
  const { level } = await params;
  const lvl = levels.find((l) => l.id === level);
  if (!lvl) return { title: 'Level Not Found' };

  const canonical = `${SITE_URL}/intersection/${lvl.id}`;
  const description = `${lvl.description} Play the free Intersection right-of-way puzzle and learn California DMV rules.`;
  return {
    title: `Intersection Puzzle: ${lvl.title}`,
    description,
    alternates: { canonical },
    openGraph: {
      title: `Intersection Puzzle: ${lvl.title}`,
      description,
      url: canonical,
      type: 'website',
      siteName: 'DMV California',
    },
    twitter: { card: 'summary', title: `Intersection Puzzle: ${lvl.title}`, description },
  };
}

export default async function IntersectionLevelPage({
  params,
}: {
  params: Promise<{ level: string }>;
}) {
  const { level } = await params;
  const idx = levels.findIndex((l) => l.id === level);
  if (idx === -1) notFound();

  const lvl = levels[idx];
  const levelNumber = idx + 1;
  const nextLevelId = idx < levels.length - 1 ? levels[idx + 1].id : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-gray-600">
          <ol className="flex items-center gap-2">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li aria-hidden>/</li>
            <li><Link href="/intersection" className="hover:text-primary">Intersection</Link></li>
            <li aria-hidden>/</li>
            <li className="text-gray-900 font-medium">Level {levelNumber}</li>
          </ol>
        </nav>

        {/* Level header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
              Level {levelNumber} of {levels.length}
            </span>
            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
              {lvl.intersectionType.replace(/-/g, ' ')}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{lvl.title}</h1>
          <p className="text-lg text-gray-600">{lvl.description}</p>
        </div>

        {/* Game + sidebar */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
            <div>
              <IntersectionGame level={lvl} nextLevelId={nextLevelId} />
              <div className="mt-6">
                <MultiplexAd />
              </div>
            </div>

            <aside className="space-y-4">
              <div className="sticky top-24 space-y-4">
                <AppPromotion variant="sidebar" />
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h2 className="text-base font-bold text-gray-900 mb-2">How to play</h2>
                  <ul className="space-y-1.5 text-sm text-gray-700">
                    <li>• Every road user is frozen in place.</li>
                    <li>• Tap them in the order they may legally go.</li>
                    <li>• A wrong tap causes a collision and shows the rule.</li>
                    <li>• Solve it with no mistakes for 3 stars.</li>
                  </ul>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h2 className="text-base font-bold text-gray-900 mb-2">Keep practicing</h2>
                  <p className="text-sm text-gray-600 mb-3">
                    Right-of-way is the most-missed topic on the DMV test. Drill it with our full practice tests.
                  </p>
                  <Link
                    href="/practice-test"
                    className="text-primary font-semibold text-sm hover:underline"
                  >
                    Take a practice test →
                  </Link>
                </div>
              </div>
            </aside>
          </div>

          {/* Level navigation */}
          <div className="mt-8 flex items-center justify-between">
            <Link
              href="/intersection"
              className="inline-flex items-center gap-2 text-primary hover:text-primary-600 font-semibold"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              All Levels
            </Link>
            {nextLevelId && (
              <Link
                href={`/intersection/${nextLevelId}`}
                className="inline-flex items-center gap-2 text-primary hover:text-primary-600 font-semibold"
              >
                Next Level
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </main>

      <Footer />
      <CookieBanner />
    </div>
  );
}
