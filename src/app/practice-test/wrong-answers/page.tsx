import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import WrongAnswersContent from './WrongAnswersContent';
import type { Quiz } from '@/types/quiz';

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
import koreanQuizzesData from '@/data/ko-quizzes.json';
import hindiQuizzesData from '@/data/hi-quizzes.json';
import motorcycleQuizzesData from '@/data/motorcycle-quizzes.json';
import commercialQuizzesData from '@/data/commercial-quizzes.json';

export const metadata = {
  title: 'Review wrong answers | DMV California',
  description: 'Revisit the questions you got wrong in previous DMV practice tests. Targeted review of your weak spots helps you pass faster.',
};

export default function WrongAnswersPage() {
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
    ...koreanQuizzesData.quizzes,
    ...hindiQuizzesData.quizzes,
    ...motorcycleQuizzesData.quizzes,
    ...commercialQuizzesData.quizzes,
  ] as Quiz[];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Review your wrong answers</h1>
            <p className="text-gray-600">
              Questions you missed in previous practice tests, assembled into one targeted session.
            </p>
          </div>
          <WrongAnswersContent allQuizzes={allQuizzes} />
        </div>
      </main>
      <Footer />
      <CookieBanner />
    </>
  );
}
