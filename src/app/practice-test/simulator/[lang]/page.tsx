import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import { Lightbulb } from 'lucide-react';
import Leaderboard from '@/components/quiz/Leaderboard';
import RelatedQuizzes from '@/components/quiz/RelatedQuizzes';
import AppPromotion from '@/components/AppPromotion';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { fetchLeaderboard } from '@/lib/leaderboard';
import { getAllFixedQuizzes } from '@/lib/allQuizzes';
import { buildLanguagePool } from '@/lib/quizPool';
import { PRACTICE_TEST_HUBS } from '@/lib/language-alternates';
import { getBaseViews } from '@/lib/quiz-base-views';
import QuizViewTracker from '@/components/quiz/QuizViewTracker';
import type { QuizLanguage } from '@/types/quiz';
import SimulatorContent from './SimulatorContent';

const SITE_URL = 'https://dmvcalifornia.us';

const LANGUAGE_NAMES: Record<QuizLanguage, string> = {
  en: 'English',
  es: 'Español',
  tr: 'Türkçe',
  zh: '中文',
  ar: 'العربية',
  hy: 'Հայերեն',
  fa: 'فارسی',
  pa: 'ਪੰਜਾਬੀ',
  ru: 'Русский',
  tl: 'Tagalog',
  vi: 'Tiếng Việt',
  ko: '한국어',
  hi: 'हिन्दी',
};

// PRACTICE_TEST_HUBS is the canonical set of supported languages across the
// site; derive from it so this route can't drift out of sync.
const SUPPORTED_LANGUAGES = Object.keys(PRACTICE_TEST_HUBS) as QuizLanguage[];

function isSupportedLanguage(lang: string): lang is QuizLanguage {
  return (SUPPORTED_LANGUAGES as string[]).includes(lang);
}

export async function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isSupportedLanguage(lang)) {
    return { title: 'Simulator Not Found' };
  }

  const name = LANGUAGE_NAMES[lang];
  const url = `${SITE_URL}/practice-test/simulator/${lang}`;
  const title = `DMV Practice Test Simulator (${name})`;
  const description = `A random set of California DMV practice questions in ${name}, drawn fresh from the full question pool every time you take it. Free, unlimited retakes.`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title: `${title} | DMV California`, description, url, type: 'website', siteName: 'DMV California' },
    twitter: { card: 'summary_large_image', title: `${title} | DMV California`, description },
  };
}

export default async function SimulatorPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isSupportedLanguage(lang)) {
    notFound();
  }

  const quizId = `simulator-${lang}`;
  const poolSize = buildLanguagePool(lang).length;
  const leaderboardEntries = await fetchLeaderboard(quizId);

  // Cross-link to a few fixed quizzes in the same language.
  const relatedQuizzes = getAllFixedQuizzes()
    .filter((q) => (q.language || 'en') === lang)
    .slice(0, 6)
    .map((q) => ({
      slug: q.slug,
      title: q.title,
      category: q.category,
      questionCount: q.questions.length,
      language: q.language || 'en',
    }));

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Link
              href="/practice-test"
              className="text-primary hover:text-primary-600 font-medium text-sm flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to All Practice Tests
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="mb-4">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                Simulator
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Practice Test Simulator ({LANGUAGE_NAMES[lang]})
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              A fresh, random question set every attempt, drawn from a pool of {poolSize} questions in{' '}
              {LANGUAGE_NAMES[lang]}, instead of the same fixed test every time.
            </p>
            <QuizViewTracker quizId={quizId} baseViews={getBaseViews(quizId)} variant="prominent" />
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
              <div>
                <SimulatorContent lang={lang} nextQuiz={relatedQuizzes[0] ? { slug: relatedQuizzes[0].slug, title: relatedQuizzes[0].title } : undefined} />
              </div>

              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-4">
                  <Leaderboard
                    entries={leaderboardEntries}
                    quizTitle={`Simulator (${LANGUAGE_NAMES[lang]})`}
                    quizId={quizId}
                    limit={10}
                  />

                  <AppPromotion variant="sidebar" />

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-1">
                      <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0" /> Quick Tips
                    </h3>
                    <ul className="space-y-1.5 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Every attempt is a different random set</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Check the explanation for each answer</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Missed questions are saved for later review</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <RelatedQuizzes quizzes={relatedQuizzes} />
      </main>

      <Footer />
      <CookieBanner />
    </>
  );
}
