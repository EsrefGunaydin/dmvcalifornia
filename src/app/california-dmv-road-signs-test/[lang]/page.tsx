import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import SignQuiz from '@/components/SignQuiz';
import SignQuizAllQuestions from '@/components/quiz/SignQuizAllQuestions';
import LanguagePills from '@/components/LanguagePills';
import Leaderboard from '@/components/quiz/Leaderboard';
import QuizViewTracker from '@/components/quiz/QuizViewTracker';
import AppPromotion from '@/components/AppPromotion';
import { getBaseViews } from '@/lib/quiz-base-views';
import {
  ROAD_SIGN_LANG_CODES,
  getRoadSignLang,
  getSignQuestions,
  type RoadSignLang,
} from '@/data/road-signs-i18n';
import { getMongoClient } from '@/lib/mongodb';
import type { LeaderboardEntry } from '@/types/quiz';

const SITE = 'https://dmvcalifornia.us';
const BASE_PATH = '/california-dmv-road-signs-test';

export const dynamicParams = false;

export function generateStaticParams() {
  return ROAD_SIGN_LANG_CODES.map((lang) => ({ lang }));
}

function hreflangAlternates() {
  const languages: Record<string, string> = {
    en: `${SITE}${BASE_PATH}`,
    'x-default': `${SITE}${BASE_PATH}`,
  };
  for (const code of ROAD_SIGN_LANG_CODES) languages[code] = `${SITE}${BASE_PATH}/${code}`;
  return languages;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const cfg = getRoadSignLang(lang);
  if (!cfg) return {};
  return {
    title: cfg.metaTitle,
    description: cfg.metaDescription,
    alternates: { canonical: `${SITE}${BASE_PATH}/${lang}`, languages: hreflangAlternates() },
    openGraph: { title: cfg.metaTitle, description: cfg.metaDescription, type: 'website' },
  };
}

async function fetchLeaderboard(quizId: string): Promise<LeaderboardEntry[]> {
  try {
    if (!process.env.MONGODB_URI) return [];
    const client = await getMongoClient();
    const db = client.db('dmvcalifornia');
    const entries = await db.collection('leaderboard')
      .find({ quizId })
      .sort({ percentage: -1, completedAt: 1 })
      .toArray();
    return entries.map((e: any) => ({
      id: e._id.toString(),
      quizId: e.quizId,
      date: e.date,
      name: e.name,
      email: e.email || '',
      points: e.points,
      percentage: e.percentage,
      completedAt: e.completedAt,
    }));
  } catch {
    return [];
  }
}

export default async function LocalizedRoadSignsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const cfg = getRoadSignLang(lang);
  if (!cfg) notFound();

  const questions = getSignQuestions(lang as RoadSignLang);
  const allTestsLabel = cfg.allTestsLabel;
  const quizId = `road-signs-${lang}`;
  const leaderboard = await fetchLeaderboard(quizId);

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: cfg.faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Header />

      <main className="min-h-screen bg-gray-50">
        <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-14">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <LanguagePills active={lang} />
              <span className="inline-block bg-white/20 px-4 py-1 rounded-full text-sm font-semibold mb-4">
                {cfg.badge}
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight" dir={cfg.dir}>
                {cfg.h1}
              </h1>
              <p className="text-xl text-white/90 mb-5" dir={cfg.dir}>
                {cfg.intro}
              </p>
              <div className="flex justify-center">
                <QuizViewTracker quizId={quizId} baseViews={getBaseViews(quizId)} variant="prominent" />
              </div>
            </div>
          </div>
        </section>

        <section className="py-10">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
                {/* Quiz */}
                <div>
                  <SignQuiz
                    questions={questions}
                    labels={cfg.labels}
                    dir={cfg.dir}
                    quizId={quizId}
                    nextQuiz={{ href: '/practice-test', title: allTestsLabel }}
                  />
                  <SignQuizAllQuestions questions={questions} label={cfg.reviewAllLabel} dir={cfg.dir} />
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                  <div className="sticky top-24 space-y-4">
                    <Leaderboard entries={leaderboard} quizTitle={cfg.h1} quizId={quizId} limit={10} />
                    <AppPromotion variant="sidebar" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-12 bg-white border-t border-gray-100">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="space-y-3" dir={cfg.dir}>
                {cfg.faq.map((f, i) => (
                  <details key={i} className="group bg-gray-50 rounded-lg border border-gray-200 p-4">
                    <summary className="font-semibold text-gray-900 cursor-pointer list-none flex justify-between items-center">
                      {f.q}
                      <span className="text-primary group-open:rotate-180 transition-transform ml-2">▾</span>
                    </summary>
                    <p className="text-gray-700 mt-3 leading-relaxed">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Keep studying */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{cfg.keepStudying}</h2>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link href="/practice-test" className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors">
                  {allTestsLabel} →
                </Link>
                <Link href="/california-dmv-road-signs-test" className="bg-gray-100 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                  English version
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <CookieBanner />
    </>
  );
}
