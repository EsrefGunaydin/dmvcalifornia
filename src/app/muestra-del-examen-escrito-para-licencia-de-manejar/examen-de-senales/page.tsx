import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import QuizEngine from '@/components/quiz/QuizEngine';
import Leaderboard from '@/components/quiz/Leaderboard';
import spanishSignTestData from '@/data/spanish-sign-test.json';
import Link from 'next/link';
import type { Quiz } from '@/types/quiz';

export const metadata: Metadata = {
  title: 'Examen de Señales de Tráfico en Español | DMV California',
  description: 'Examen de señales de tráfico del DMV de California en español - 32 preguntas con imágenes de señales reales. Spanish traffic signs test with 32 image-based questions.',
  keywords: ['DMV español', 'señales de tráfico español', 'California DMV Spanish test', 'traffic signs Spanish', 'examen señales'],
  openGraph: {
    title: 'Examen de Señales de Tráfico en Español | DMV California',
    description: 'Examen de señales de tráfico del DMV de California en español - 32 preguntas con imágenes de señales reales',
    type: 'website',
  }
};

async function fetchLeaderboard(quizId: string | number) {
  // Skip this non-essential fetch during the static build: a localhost site URL
  // (or a dev server on the same port) makes the page dynamic and breaks
  // generation. The leaderboard still loads at runtime in dev and production.
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!baseUrl || process.env.NEXT_PHASE === 'phase-production-build') return [];
  try {
    const response = await fetch(`${baseUrl}/api/leaderboard?quizId=${quizId}`, {
      cache: 'no-store', // Always fetch fresh data
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

export default async function SpanishSignTestPage() {
  const quiz = spanishSignTestData.quiz as Quiz;
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
              href="/muestra-del-examen-escrito-para-licencia-de-manejar"
              className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver a Exámenes en Español / Back to Spanish Tests
            </Link>
          </div>

          {/* Quiz Header */}
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg shadow-lg p-6 mb-8 border-2 border-blue-100">
            <div className="mb-4 flex items-center gap-2">
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                {quiz.category}
              </span>
              <span className="text-2xl">🇪🇸</span>
              <span className="text-2xl">🚦</span>
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span><strong>{quiz.questions.length}</strong> Preguntas con Imágenes</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span><strong>{quiz.passingScore}%</strong> para Aprobar</span>
              </div>
              {quiz.timeLimit && (
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span><strong>{quiz.timeLimit}</strong> Minutos</span>
                </div>
              )}
            </div>
          </div>

          {/* Centered Layout */}
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
              {/* Quiz Engine */}
              <div>
                <QuizEngine quiz={quiz} quizId={quizId} />
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-4">
                  <Leaderboard
                    entries={quizLeaderboard}
                    quizTitle={quiz.title}
                    quizId={quizId}
                    limit={10}
                  />

                  {/* Quick Tips Card */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-1">
                      💡 Consejos Rápidos
                    </h3>
                    <ul className="space-y-1.5 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Observe cuidadosamente cada señal</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Preste atención a las formas y colores</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Lea la explicación de cada respuesta</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Practique hasta memorizar todas las señales</span>
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
