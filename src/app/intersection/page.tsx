import Link from 'next/link';
import { Metadata } from 'next';
import { Navigation } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import AppPromotion from '@/components/AppPromotion';
import IntersectionLevelGrid from '@/components/games/IntersectionLevelGrid';
import levelsData from '@/data/intersection-levels.json';
import { IntersectionLevel } from '@/types/intersection';

const SITE_URL = 'https://www.dmvcalifornia.us';
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
      <section className="bg-gradient-to-r from-primary to-primary-600 text-white py-14">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <Navigation className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Intersection — The Right-of-Way Puzzle
            </h1>
            <p className="text-xl text-white/90 mb-6">
              Right-of-way is the topic drivers miss most on the DMV test. Stop memorizing rules —
              start <em>solving</em> intersections. Tap each road user in the order they may legally
              proceed. Get it wrong and you'll see exactly which rule caused the crash.
            </p>
            <div className="flex flex-wrap gap-4 justify-center text-sm">
              <span className="bg-white/20 px-4 py-2 rounded-full">10 levels</span>
              <span className="bg-white/20 px-4 py-2 rounded-full">Real California rules</span>
              <span className="bg-white/20 px-4 py-2 rounded-full">Free · no signup</span>
            </div>
          </div>
        </div>
      </section>

      {/* App promo banner */}
      <div className="container mx-auto px-4 pt-6">
        <AppPromotion variant="banner" />
      </div>

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
