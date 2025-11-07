import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import QuizEngine from '@/components/quiz/QuizEngine';
import Leaderboard from '@/components/quiz/Leaderboard';
import turkishQuizzesData from '@/data/turkish-quizzes.json';
import Link from 'next/link';

export const metadata = {
  title: 'DMV Turkish Test #1 / DMV Türkçe Test #1 | DMV California',
  description: 'California DMV Türkçe Test #1. Temel trafik kuralları ve işaretler için 36 soru.',
};

async function fetchLeaderboard(quizId: string | number) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/leaderboard?quizId=${quizId}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Failed to fetch leaderboard:', response.status);
      return [];
    }

    const data = await response.json();
    return data.leaderboard || [];
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
}

export default async function TurkishTest1Page() {
  const quiz = turkishQuizzesData.quizzes[0]; // First Turkish quiz
  const quizId = quiz.id; // Use the quiz's id field

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
              href="/dmv-turkish-test"
              className="text-red-600 hover:text-red-700 font-medium text-sm flex items-center gap-2"
            >
              <svg className="w-4 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Türkçe Testlere Geri Dön / Back to Turkish Tests
            </Link>
          </div>

          {/* Quiz Header */}
          <div className="bg-gradient-to-br from-red-50 to-white rounded-lg shadow-lg p-6 mb-8 border-2 border-red-100">
            <div className="mb-4 flex items-center gap-2">
              <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                {quiz.category}
              </span>
              <span className="text-2xl">🇹🇷</span>
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
                <span><strong>{quiz.questions.length}</strong> Soru / Questions</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span><strong>{quiz.passingScore}%</strong> Geçmek İçin Gerekli / Required to Pass</span>
              </div>
              {quiz.timeLimit && (
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span><strong>{quiz.timeLimit}</strong> Dakika / Minutes</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quiz Engine */}
            <div className="lg:col-span-2">
              <QuizEngine quiz={quiz} quizId={quizId} />
            </div>

            {/* Leaderboard Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <Leaderboard
                  entries={quizLeaderboard}
                  quizTitle={quiz.title}
                  limit={10}
                />

                {/* Additional Info Card */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 mt-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    💡 Hızlı İpuçları / Quick Tips
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Her soruyu dikkatlice okuyun / Read each question carefully</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Her cevap için açıklamayı kontrol edin / Check explanation for each answer</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>İlerlemeniz otomatik olarak kaydedilir / Progress is automatically saved</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>İstediğiniz kadar tekrar edebilirsiniz / Retake as many times as needed</span>
                    </li>
                  </ul>
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
