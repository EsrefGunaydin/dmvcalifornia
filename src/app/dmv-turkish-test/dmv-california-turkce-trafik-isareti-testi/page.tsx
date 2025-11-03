import { Metadata } from 'next';
import QuizEngine from '@/components/quiz/QuizEngine';
import Leaderboard from '@/components/quiz/Leaderboard';
import turkishSignTestData from '@/data/turkish-sign-test.json';
import leaderboardData from '@/data/leaderboard.json';

export const metadata: Metadata = {
  title: 'DMV Türkçe Trafik İşareti Testi | DMV California',
  description: 'California DMV Türkçe trafik işareti testi - 8 soruluk görsel işaret tanıma testi. California DMV Turkish traffic sign identification test with 8 image-based questions.',
  keywords: ['DMV türkçe test', 'türkçe trafik işareti', 'California DMV Turkish test', 'traffic signs Turkish', 'DMV işaret testi'],
  openGraph: {
    title: 'DMV Türkçe Trafik İşareti Testi | DMV California',
    description: 'California DMV Türkçe trafik işareti testi - 8 soruluk görsel işaret tanıma testi',
    type: 'website',
  }
};

export default function TurkishSignTestPage() {
  const quiz = turkishSignTestData.quiz;

  // Filter leaderboard for Turkish sign test (quiz ID 103)
  const quizLeaderboard = leaderboardData.leaderboard
    .filter(entry => entry.quizId === 103)
    .sort((a, b) => b.points - a.points)
    .slice(0, 10);

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
            <p className="text-lg opacity-90">
              8 soruluk görsel trafik işareti tanıma testi • 8 image-based traffic sign questions
            </p>
          </div>
        </div>
      </section>

      {/* Quiz Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quiz Engine - 2 columns */}
            <div className="lg:col-span-2">
              <QuizEngine quiz={quiz} />
            </div>

            {/* Sidebar - 1 column, sticky */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Leaderboard */}
                <Leaderboard
                  entries={quizLeaderboard}
                  quizTitle={quiz.title}
                  limit={10}
                />

                {/* Quick Tips Card - Bilingual */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    💡 İpuçları / Tips
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
                      <span>Geçmek için %75 (6/8) gerekli / Need 75% (6/8) to pass</span>
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
                      <span>8</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Süre / Time:</span>
                      <span>10 dakika / minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Geçme Notu / Passing:</span>
                      <span>75% (6/8)</span>
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
