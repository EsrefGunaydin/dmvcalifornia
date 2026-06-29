import Link from 'next/link';
import { Metadata } from 'next';
import { Eye } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import AppPromotion from '@/components/AppPromotion';
import HazardSceneGrid from '@/components/games/HazardSceneGrid';
import scenesData from '@/data/hazard-scenes.json';
import { HazardScene } from '@/types/hazard';

const SITE_URL = 'https://www.dmvcalifornia.us';
const scenes = scenesData.scenes as unknown as HazardScene[];

export const metadata: Metadata = {
  title: 'Eyes on the Road — The Hazard-Spotting Game',
  description:
    'A free hazard-perception game for California drivers. Scan a street scene and tap every developing hazard before the timer runs out, across 8 escalating scenes.',
  alternates: { canonical: `${SITE_URL}/eyes-on-the-road` },
  openGraph: {
    title: 'Eyes on the Road — The Hazard-Spotting Game | DMV California',
    description:
      'Train your hazard perception by playing. Spot jaywalkers, opening car doors, loose dogs and more before time runs out.',
    url: `${SITE_URL}/eyes-on-the-road`,
    type: 'website',
    siteName: 'DMV California',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Eyes on the Road — The Hazard-Spotting Game',
    description: 'Train your hazard perception by playing. 8 free timed scenes.',
  },
};

export default function EyesOnTheRoadLandingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-r from-slate-800 to-slate-700 text-white py-14">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-3">
              <Eye className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Eyes on the Road — The Hazard-Spotting Game
            </h1>
            <p className="text-xl text-white/90 mb-6">
              Good drivers don&apos;t just follow rules — they <em>see trouble coming</em>. Each
              scene drops you into a street with hidden hazards: a ball rolling out, a door swinging
              open, a dog in the road. Tap every one before the clock runs out.
            </p>
            <div className="flex flex-wrap gap-4 justify-center text-sm">
              <span className="bg-white/20 px-4 py-2 rounded-full">8 timed scenes</span>
              <span className="bg-white/20 px-4 py-2 rounded-full">Trains real hazard perception</span>
              <span className="bg-white/20 px-4 py-2 rounded-full">Free · no signup</span>
            </div>
          </div>
        </div>
      </section>

      {/* App promo banner */}
      <div className="container mx-auto px-4 pt-6">
        <AppPromotion variant="banner" />
      </div>

      {/* Scene grid */}
      <section className="container mx-auto px-4 py-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Choose a Scene</h2>
            <p className="text-gray-600">
              Play a scene to unlock the next. Each one gets busier — and gives you less time.
            </p>
          </div>

          <HazardSceneGrid scenes={scenes} />
        </div>
      </section>

      {/* Why it works */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              Why hazard-spotting makes you a safer driver
            </h2>
            <p className="text-gray-600 mb-4">
              Most crashes don&apos;t happen because a driver forgot a rule — they happen because the
              driver didn&apos;t <em>see</em> the hazard in time. The DMV calls it scanning: keeping
              your eyes moving and reading the whole scene. Eyes on the Road trains exactly that. The
              timer forces you to scan fast, the scenes hide real hazards among harmless decoys, and
              every round shows you what you missed and why it mattered.
            </p>
            <div className="text-center mt-6">
              <Link
                href={`/eyes-on-the-road/${scenes[0].id}`}
                className="inline-block bg-primary hover:bg-primary-600 text-white font-bold py-3 px-8 rounded-lg transition-colors"
              >
                Start Scene 1
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
