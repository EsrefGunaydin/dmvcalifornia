import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import QuizEngine from '@/components/quiz/QuizEngine';
import Leaderboard from '@/components/quiz/Leaderboard';
import AppPromotion from '@/components/AppPromotion';
import quizzesData from '@/data/quizzes.json';
import chineseQuizzesData from '@/data/chinese-quizzes.json';
import turkishQuizzesData from '@/data/turkish-quizzes.json';
import turkishSignTestData from '@/data/turkish-sign-test.json';
import spanishSignTestData from '@/data/spanish-sign-test.json';
import arabicQuizzesData from '@/data/arabic-quizzes.json';
import armenianQuizzesData from '@/data/armenian-quizzes.json';
import farsiQuizzesData from '@/data/farsi-quizzes.json';
import punjabiQuizzesData from '@/data/punjabi-quizzes.json';
import russianQuizzesData from '@/data/russian-quizzes.json';
import tagalogQuizzesData from '@/data/tagalog-quizzes.json';
import vietnameseQuizzesData from '@/data/vietnamese-quizzes.json';
import motorcycleQuizzesData from '@/data/motorcycle-quizzes.json';
import commercialQuizzesData from '@/data/commercial-quizzes.json';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getMongoClient } from '@/lib/mongodb';
import type { Quiz } from '@/types/quiz';

// Combine all quizzes across languages
const allQuizzes = [
  ...quizzesData.quizzes,
  ...chineseQuizzesData.quizzes,
  ...turkishQuizzesData.quizzes,
  turkishSignTestData.quiz,
  spanishSignTestData.quiz,
  ...arabicQuizzesData.quizzes,
  ...armenianQuizzesData.quizzes,
  ...farsiQuizzesData.quizzes,
  ...punjabiQuizzesData.quizzes,
  ...russianQuizzesData.quizzes,
  ...tagalogQuizzesData.quizzes,
  ...vietnameseQuizzesData.quizzes,
  ...motorcycleQuizzesData.quizzes,
  ...commercialQuizzesData.quizzes,
] as Quiz[];

export async function generateStaticParams() {
  return allQuizzes.map((quiz) => ({
    slug: quiz.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const quiz = allQuizzes.find((q) => q.slug === slug);

  if (!quiz) {
    return {
      title: 'Quiz Not Found | DMV California',
    };
  }

  return {
    title: `${quiz.title} | DMV California`,
    description: quiz.description,
  };
}

async function fetchLeaderboard(quizId: string | number) {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI not configured');
      return [];
    }

    const client = await getMongoClient();
    const db = client.db('dmvcalifornia');
    const collection = db.collection('leaderboard');

    // Build query
    let query: any = {};
    if (quizId) {
      const numericQuizId = typeof quizId === 'string' ? parseInt(quizId) : quizId;
      if (!isNaN(numericQuizId)) {
        query = { $or: [{ quizId: numericQuizId }, { quizId: String(quizId) }] };
      } else {
        query = { quizId: quizId };
      }
    }

    const entries = await collection
      .find(query)
      .sort({ percentage: -1, completedAt: 1 })
      .toArray();

    return entries.map((entry: any) => ({
      id: entry._id.toString(),
      quizId: entry.quizId,
      date: entry.date,
      name: entry.name,
      email: entry.email || '',
      points: entry.points,
      percentage: entry.percentage,
      completedAt: entry.completedAt,
    }));
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
}

export default async function QuizPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const quiz = allQuizzes.find((q) => q.slug === slug);

  if (!quiz) {
    notFound();
  }

  // Use the quiz's id field for leaderboard tracking
  const quizId = quiz.id;

  // Fetch leaderboard from MongoDB API
  const quizLeaderboard = await fetchLeaderboard(quizId);

  return (
    <>
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
            <p className="text-lg text-gray-600 mb-6">
              {quiz.description}
            </p>

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
                <QuizEngine quiz={quiz} quizId={quizId} />
              </div>

              {/* Compact Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-4">
                  <Leaderboard
                    entries={quizLeaderboard}
                    quizTitle={quiz.title}
                    limit={10}
                  />

                  {/* App Promotion */}
                  <AppPromotion variant="sidebar" />

                  {/* Compact Quick Tips Card */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-1">
                    💡 Quick Tips
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
      </main>

      <Footer />
      <CookieBanner />
    </>
  );
}
