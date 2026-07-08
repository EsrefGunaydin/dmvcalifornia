import Link from 'next/link';
import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import IntersectionLevelGrid from '@/components/games/IntersectionLevelGrid';
import levelsData from '@/data/intersection-levels.json';
import { IntersectionLevel } from '@/types/intersection';

const SITE_URL = 'https://dmvcalifornia.us';
const levels = levelsData.levels as unknown as IntersectionLevel[];

export const metadata: Metadata = {
  title: 'Intersection — The Right-of-Way Puzzle Game',
  description:
    'A free puzzle game that teaches California right-of-way rules. Tap road users in the order they may legally proceed across 10 escalating intersections.',
  alternates: { canonical: `${SITE_URL}/intersection` },
  openGraph: {
    title: 'Intersection — The Right-of-Way Puzzle Game | DMV California',
    description:
      'Learn the most-missed DMV topic by playing. Tap cars, cyclists and pedestrians in the legal order they may proceed.',
    url: `${SITE_URL}/intersection`,
    type: 'website',
    siteName: 'DMV California',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Intersection — The Right-of-Way Puzzle Game',
    description: 'Learn California right-of-way rules by playing. 10 free puzzle levels.',
  },
};

export default function IntersectionLandingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-r from-primary to-primary-600 text-white py-7">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Right-of-Way Puzzle
            </h1>
            <p className="text-white/85 text-sm mb-4">
              Tap each road user in the order they may legally proceed. Get it wrong and you&apos;ll see exactly which California rule caused the crash.
            </p>
            <div className="flex flex-wrap gap-2 justify-center text-xs">
              <span className="bg-white/20 px-3 py-1.5 rounded-full">10 levels</span>
              <span className="bg-white/20 px-3 py-1.5 rounded-full">Real California rules</span>
              <span className="bg-white/20 px-3 py-1.5 rounded-full">Free · no signup</span>
            </div>
          </div>
        </div>
      </section>

      {/* Level grid */}
      <section className="container mx-auto px-4 py-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Choose a Level</h2>
            <p className="text-gray-600">
              Clear a level to unlock the next. Each one teaches a different right-of-way rule.
            </p>
          </div>

          <IntersectionLevelGrid levels={levels} />
        </div>
      </section>

      {/* Why it works */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              Why a puzzle beats flashcards for right-of-way
            </h2>
            <p className="text-gray-600 mb-4">
              The written DMV test asks &ldquo;who goes first?&rdquo; — but real driving asks you to
              read a whole intersection at once. Intersection drops you into the situation and makes
              you sequence every road user. When you misjudge it, you watch the collision and read
              the exact California Vehicle Code rule you broke. That&apos;s how the rule actually
              sticks.
            </p>
            <div className="text-center mt-6">
              <Link
                href={`/intersection/${levels[0].id}`}
                className="inline-block bg-primary hover:bg-primary-600 text-white font-bold py-3 px-8 rounded-lg transition-colors"
              >
                Start Level 1
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <CookieBanner />
    </div>
  );
}
