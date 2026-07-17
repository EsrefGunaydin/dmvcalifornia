import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import Hardest20Quiz, { type HardestQuestion } from '@/components/Hardest20Quiz';
import QuizViewTracker from '@/components/quiz/QuizViewTracker';
import { getBaseViews } from '@/lib/quiz-base-views';
import hardestData from '@/data/hardest-20-questions.json';

const questions = hardestData.questions as HardestQuestion[];

export const metadata: Metadata = {
  title: 'The 20 Hardest Questions on the DMV Written Test | Answers Teens Always Miss',
  description:
    'The 20 hardest California DMV written test questions, ranked. Tap an answer, see if you got it right, and read why teens always miss it. Free interactive permit-test practice.',
  keywords: [
    'hardest DMV test questions',
    'DMV written test questions teens miss',
    'California permit test hard questions',
    'DMV practice test',
    'permit test questions and answers',
  ],
  openGraph: {
    title: 'The 20 Hardest Questions on the DMV Written Test',
    description:
      'Ranked hardest to easiest. Tap an answer, see if you got it right, and learn why teens always miss it.',
    type: 'article',
  },
};

export default function Hardest20Page() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
        {/* Hero */}
        <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-block bg-white/20 px-4 py-1 rounded-full text-sm font-semibold mb-5">
                Counting down: #20 → #1 hardest
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-5 leading-tight">
                The 20 Hardest Questions on the DMV Written Test
              </h1>
              <p className="text-xl text-white/90 mb-6">
                Answers to the permit-test questions teens always miss.
              </p>
              <QuizViewTracker
                quizId="hardest-20-questions"
                baseViews={getBaseViews('hardest-20-questions')}
                variant="prominent"
                label="have gone through these questions"
              />
            </div>
          </div>
        </section>

        {/* Intro (blog-style) */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto prose prose-lg">
              <p className="text-gray-700 leading-relaxed">
                Most people don&apos;t fail the California DMV written test because it&apos;s long —
                they fail because of a handful of <strong>tricky questions</strong> with answers that
                feel wrong but are right. We ranked the 20 that trip up the most teens — starting at{' '}
                <strong>#20</strong> and counting down to the <strong>#1 hardest of all</strong>.
              </p>
              <p className="text-gray-700 leading-relaxed">
                This isn&apos;t a typical quiz. For each one, <strong>tap the answer you think is
                correct</strong> — it&apos;ll show you instantly whether you got it right, then explain{' '}
                <em>why</em> the right answer is right and why so many people pick the wrong one. No
                score to stress over; just learn the ones you miss.
              </p>
            </div>
          </div>
        </section>

        {/* Interactive quiz */}
        <section className="pb-12">
          <div className="container mx-auto px-4">
            <Hardest20Quiz questions={questions} />
          </div>
        </section>

        {/* CTA */}
        <section className="py-14 bg-white border-t border-gray-100">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Ready for the full thing?
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                You&apos;ve seen the hardest ones — now take a complete, timed practice test to make
                sure you&apos;re ready for the real California DMV written exam.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/practice-test/california-dmv-practice-test-2026"
                  className="inline-block bg-primary text-white px-7 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors"
                >
                  Take the 2026 Practice Test →
                </Link>
                <Link
                  href="/practice-test"
                  className="inline-block bg-gray-100 text-gray-800 px-7 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  Browse all practice tests
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <CookieBanner />
    </>
  );
}
