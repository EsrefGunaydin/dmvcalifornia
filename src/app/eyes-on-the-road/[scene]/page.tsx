import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import AppPromotion from '@/components/AppPromotion';
import MultiplexAd from '@/components/MultiplexAd';
import HazardGame from '@/components/games/HazardGame';
import scenesData from '@/data/hazard-scenes.json';
import { HazardScene } from '@/types/hazard';

const SITE_URL = 'https://dmvcalifornia.us';
const scenes = scenesData.scenes as unknown as HazardScene[];

export function generateStaticParams() {
  return scenes.map((scene) => ({ scene: scene.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ scene: string }>;
}): Promise<Metadata> {
  const { scene } = await params;
  const found = scenes.find((s) => s.id === scene);
  if (!found) return { title: 'Scene Not Found' };

  const canonical = `${SITE_URL}/eyes-on-the-road/${found.id}`;
  const description = `${found.description} Play the free Eyes on the Road hazard-spotting game and sharpen your California driving awareness.`;
  return {
    title: `Hazard-Spotting Game: ${found.title}`,
    description,
    alternates: { canonical },
    openGraph: {
      title: `Hazard-Spotting Game: ${found.title}`,
      description,
      url: canonical,
      type: 'website',
      siteName: 'DMV California',
    },
    twitter: { card: 'summary', title: `Hazard-Spotting Game: ${found.title}`, description },
  };
}

export default async function HazardScenePage({
  params,
}: {
  params: Promise<{ scene: string }>;
}) {
  const { scene } = await params;
  const idx = scenes.findIndex((s) => s.id === scene);
  if (idx === -1) notFound();

  const current = scenes[idx];
  const sceneNumber = idx + 1;
  const nextSceneId = idx < scenes.length - 1 ? scenes[idx + 1].id : null;
  const hazardCount = current.elements.filter((e) => e.isHazard).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-gray-600">
          <ol className="flex items-center gap-2">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li aria-hidden>/</li>
            <li><Link href="/eyes-on-the-road" className="hover:text-primary">Eyes on the Road</Link></li>
            <li aria-hidden>/</li>
            <li className="text-gray-900 font-medium">Scene {sceneNumber}</li>
          </ol>
        </nav>

        {/* Scene header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
              Scene {sceneNumber} of {scenes.length}
            </span>
            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium capitalize">
              {current.setting.replace(/-/g, ' ')}
            </span>
            <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-medium">
              {hazardCount} hazards · {current.timeLimit}s
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{current.title}</h1>
          <p className="text-lg text-gray-600">{current.description}</p>
        </div>

        {/* Game + sidebar */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
            <div>
              <HazardGame scene={current} nextSceneId={nextSceneId} />
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
                    <li>• The clock starts when you hit &ldquo;Start scanning&rdquo;.</li>
                    <li>• Tap every developing hazard you can spot.</li>
                    <li>• Tapping something harmless costs you — choose carefully.</li>
                    <li>• Find them all with no wrong taps for 3 stars.</li>
                  </ul>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h2 className="text-base font-bold text-gray-900 mb-2">Keep practicing</h2>
                  <p className="text-sm text-gray-600 mb-3">
                    Hazard awareness is half of safe driving. Drill the rules too with our full
                    California practice tests.
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

          {/* Scene navigation */}
          <div className="mt-8 flex items-center justify-between">
            <Link
              href="/eyes-on-the-road"
              className="inline-flex items-center gap-2 text-primary hover:text-primary-600 font-semibold"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              All Scenes
            </Link>
            {nextSceneId && (
              <Link
                href={`/eyes-on-the-road/${nextSceneId}`}
                className="inline-flex items-center gap-2 text-primary hover:text-primary-600 font-semibold"
              >
                Next Scene
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
