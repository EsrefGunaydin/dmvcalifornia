import { Metadata } from 'next';
import { Lightbulb } from 'lucide-react';
import QuizEngine from '@/components/quiz/QuizEngine';
import Leaderboard from '@/components/quiz/Leaderboard';
import QuizViewTracker from '@/components/quiz/QuizViewTracker';
import { getBaseViews } from '@/lib/quiz-base-views';
import turkishSignTestData from '@/data/turkish-sign-test.json';
import type { Quiz } from '@/types/quiz';

export const metadata: Metadata = {
  title: 'DMV Türkçe Trafik İşareti Testi',
  description: 'California DMV Türkçe trafik işareti testi - 24 soruluk görsel işaret tanıma testi. California DMV Turkish traffic sign identification test with 24 image-based questions.',
  keywords: ['DMV türkçe test', 'türkçe trafik işareti', 'California DMV Turkish test', 'traffic signs Turkish', 'DMV işaret testi'],
  openGraph: {
    title: 'DMV Türkçe Trafik İşareti Testi | DMV California',
    description: 'California DMV Türkçe trafik işareti testi - 24 soruluk görsel işaret tanıma testi',
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

export default async function TurkishSignTestPage() {
  const quiz = turkishSignTestData.quiz as Quiz;
  const quizId = quiz.id; // Use the quiz's id field

  // Fetch leaderboard from MongoDB API
  const quizLeaderboard = await fetchLeaderboard(quizId);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">
              DMV Türkçe Trafik İşareti Testi
            </h1>
            <p className="text-xl mb-2">
              California DMV Turkish Traffic Sign Test
            </p>
            <p className="text-lg opacity-90 mb-5">
              24 soruluk görsel trafik işareti tanıma testi • 24 image-based traffic sign questions
            </p>
            <div className="flex justify-center">
              <QuizViewTracker quizId={quizId} baseViews={getBaseViews(quizId)} variant="prominent" />
            </div>
          </div>
        </div>
      </section>

      {/* Quiz Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quiz Engine - 2 columns */}
            <div className="lg:col-span-2">
              <QuizEngine quiz={quiz} quizId={quizId} />
            </div>

            {/* Sidebar - 1 column, sticky */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Leaderboard */}
                <Leaderboard
                  entries={quizLeaderboard}
                  quizTitle={quiz.title}
                  quizId={quizId}
                  limit={10}
                />

                {/* Quick Tips Card - Bilingual */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0" /> İpuçları / Tips
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 mt-1">•</span>
                      <span>Her işareti dikkatlice inceleyin / Examine each sign carefully</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 mt-1">•</span>
                      <span>İşaretin şeklini ve rengini not edin / Note the shape and color</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 mt-1">•</span>
                      <span>Geçmek için %75 (18/24) gerekli / Need 75% (18/24) to pass</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 mt-1">•</span>
                      <span>Testi istediğiniz kadar tekrarlayın / Retake as many times as needed</span>
                    </li>
                  </ul>
                </div>

                {/* Test Info */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    Test Bilgileri / Test Info
                  </h3>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex justify-between">
                      <span className="font-medium">Sorular / Questions:</span>
                      <span>24</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Süre / Time:</span>
                      <span>30 dakika / minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Geçme Notu / Passing:</span>
                      <span>75% (18/24)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Dil / Language:</span>
                      <span>Türkçe / Turkish</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      </main>
  );
}
