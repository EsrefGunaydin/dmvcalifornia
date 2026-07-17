import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import WrongAnswersContent from './WrongAnswersContent';
import { getAllFixedQuizzes } from '@/lib/allQuizzes';
import { getSimulatorPoolQuiz } from '@/lib/quizPool';
import { PRACTICE_TEST_HUBS } from '@/lib/language-alternates';
import type { QuizLanguage } from '@/types/quiz';

export const metadata = {
  title: 'Review wrong answers | DMV California',
  description: 'Revisit the questions you got wrong in previous DMV practice tests. Targeted review of your weak spots helps you pass faster.',
};

export default function WrongAnswersPage() {
  // Register each language's full simulator pool (not just a drawn subset)
  // so a missed question from a simulator attempt stays resolvable here.
  const simulatorLanguages = Object.keys(PRACTICE_TEST_HUBS) as QuizLanguage[];
  const allQuizzes = [
    ...getAllFixedQuizzes(),
    ...simulatorLanguages.map((lang) => getSimulatorPoolQuiz(lang)),
  ];

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
