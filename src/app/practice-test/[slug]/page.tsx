import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import { Lightbulb } from 'lucide-react';
import QuizEngine from '@/components/quiz/QuizEngine';
import Leaderboard from '@/components/quiz/Leaderboard';
import QuizViewTracker from '@/components/quiz/QuizViewTracker';
import RelatedQuizzes from '@/components/quiz/RelatedQuizzes';
import { getBaseViews } from '@/lib/quiz-base-views';
import AppPromotion from '@/components/AppPromotion';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllFixedQuizzes } from '@/lib/allQuizzes';
import { fetchLeaderboard } from '@/lib/leaderboard';

const allQuizzes = getAllFixedQuizzes();

// Regenerate the static page periodically so the server-rendered leaderboard
// snapshot (used for first paint + crawlers) doesn't stay frozen at build time.
// The Leaderboard widget also refreshes live on the client.
export const revalidate = 300;

export async function generateStaticParams() {
  return allQuizzes.map((quiz) => ({
    slug: quiz.slug,
  }));
}

const SITE_URL = 'https://dmvcalifornia.us';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const quiz = allQuizzes.find((q) => q.slug === slug);

  if (!quiz) {
    return {
      title: 'Quiz Not Found | DMV California',
    };
  }

  const url = `${SITE_URL}/practice-test/${quiz.slug}`;
  const lang = quiz.language || 'en';

  return {
    title: `${quiz.title} | DMV California`,
    description: quiz.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: quiz.title,
      description: quiz.description,
      url,
      type: 'website',
      siteName: 'DMV California',
      locale: lang === 'en' ? 'en_US' : lang,
    },
    twitter: {
      card: 'summary_large_image',
      title: quiz.title,
      description: quiz.description,
    },
  };
}

export default async function QuizPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const quiz = allQuizzes.find((q) => q.slug === slug);

  if (!quiz) {
    notFound();
  }

  // Use the quiz's id field for leaderboard tracking
  const quizId = quiz.id;

  // Related tests for cross-linking (same category first, then same language,
  // then anything) — lifts pageviews-per-session.
  const lang = (quiz.language as string) || 'en';
  const others = allQuizzes.filter((q) => q.slug !== quiz.slug);
  const sameCategory = others.filter((q) => q.category === quiz.category);
  const sameLanguage = others.filter(
    (q) => ((q.language as string) || 'en') === lang && q.category !== quiz.category
  );
  const picked = [...sameCategory, ...sameLanguage];
  const rest = others.filter((q) => !picked.includes(q));
  const relatedQuizzes = [...picked, ...rest].slice(0, 6).map((q) => ({
    slug: q.slug,
    title: q.title,
    category: q.category,
    questionCount: q.questions.length,
    language: (q.language as string) || 'en',
  }));

  // Fetch leaderboard from MongoDB API
  const quizLeaderboard = await fetchLeaderboard(quizId);

  const quizSchema = {
    '@context': 'https://schema.org',
    '@type': 'Quiz',
    name: quiz.title,
    description: quiz.description,
    url: `${SITE_URL}/practice-test/${quiz.slug}`,
    educationalLevel: 'Beginner',
    inLanguage: quiz.language || 'en',
    about: {
      '@type': 'Thing',
      name: 'California DMV written knowledge test',
    },
    hasPart: quiz.questions.slice(0, 10).map((q) => ({
      '@type': 'Question',
      eduQuestionType: 'Multiple choice',
      text: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.options[q.correctAnswer],
      },
    })),
    provider: {
      '@type': 'Organization',
      name: 'DMV California',
      url: SITE_URL,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(quizSchema) }}
      />
      <Header />

      <main className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
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

          {/* Quiz Header */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="mb-4">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                {quiz.category}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              {quiz.title}
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              {quiz.description}
            </p>

            <div className="mb-6">
              <QuizViewTracker quizId={quizId} baseViews={getBaseViews(quizId)} variant="prominent" />
            </div>

            {/* Quiz Stats */}
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span><strong>{quiz.questions.length}</strong> Questions</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span><strong>{quiz.passingScore}%</strong> Required to Pass</span>
              </div>
              {quiz.timeLimit && (
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span><strong>{quiz.timeLimit}</strong> Minutes Time Limit</span>
                </div>
              )}
            </div>
          </div>

          {/* Centered Layout with Space for Ads */}
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
              {/* Quiz Engine */}
              <div>
                <QuizEngine
                  quiz={quiz}
                  quizId={quizId}
                  nextQuiz={
                    relatedQuizzes[0]
                      ? { slug: relatedQuizzes[0].slug, title: relatedQuizzes[0].title }
                      : undefined
                  }
                />
              </div>

              {/* Compact Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-4">
                  <Leaderboard
                    entries={quizLeaderboard}
                    quizTitle={quiz.title}
                    quizId={quizId}
                    limit={10}
                  />

                  {/* App Promotion */}
                  <AppPromotion variant="sidebar" />

                  {/* Compact Quick Tips Card */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-1">
                    <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0" /> Quick Tips
                  </h3>
                  <ul className="space-y-1.5 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Read each question carefully</span>
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
                      <span>Your progress is automatically saved</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Retake as many times as you need</span>
                    </li>
                  </ul>
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <RelatedQuizzes quizzes={relatedQuizzes} simulatorLang={lang} />
      </main>

      <Footer />
      <CookieBanner />
    </>
  );
}
