import Link from 'next/link';
import { Metadata } from 'next';
import { Globe, Navigation } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import koreanQuizzesData from '@/data/ko-quizzes.json';
import { languageAlternates } from '@/lib/language-alternates';

export const metadata: Metadata = {
  alternates: languageAlternates('ko'),
  title: 'DMV California 한국어 시험',
  description:
    '무료 캘리포니아 DMV 한국어 연습 시험. 운전면허 준비를 위한 실제 문제. California DMV practice test in Korean.',
  keywords: [
    'DMV 한국어',
    '한국어 운전 시험',
    '캘리포니아 운전면허',
    'California DMV Korean test',
    'Korean driving test California',
    'DMV practice test in Korean',
  ],
  openGraph: {
    title: 'DMV California 한국어 시험',
    description: '무료 캘리포니아 DMV 한국어 연습 시험.',
    type: 'website',
  },
};

export default function KoreanTestPage() {
  const quizzes = koreanQuizzesData.quizzes;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
                <Globe className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">DMV 한국어 연습 시험</h1>
              <p className="text-xl text-white/90 mb-2">
                캘리포니아 DMV 연습 시험 — 실제 문제로 연습하세요.
              </p>
              <p className="text-base text-white/80">California DMV practice test in Korean.</p>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">DMV 한국어 시험</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {quizzes.map((quiz) => (
                <Link
                  key={quiz.id}
                  href={`/practice-test/${quiz.slug}`}
                  className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow overflow-hidden group border-2 border-blue-100"
                >
                  <div className="p-6">
                    <div className="mb-4 flex gap-2 flex-wrap">
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                        시험
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {quiz.title.split(' / ')[1] || quiz.title}
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm">{quiz.description.split('. ')[0]}.</p>
                    <div className="flex items-center justify-between pt-4 border-t">
                      <span className="text-sm text-gray-500">{quiz.questions.length}문항</span>
                      <span className="text-blue-600 font-semibold group-hover:underline">시작하기 →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Road signs CTA */}
            <div className="bg-white rounded-2xl border-2 border-blue-100 shadow-sm p-6 text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2"><Navigation className="w-5 h-5 text-blue-600" /> 한국어 도로 표지판 시험</h3>
              <p className="text-gray-600 mb-4">
                실제 표지판 이미지 38개로 캘리포니아 교통 표지판을 연습하세요.
              </p>
              <Link
                href="/california-dmv-road-signs-test/ko"
                className="inline-block bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                도로 표지판 시험 시작 →
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <CookieBanner />
    </>
  );
}
