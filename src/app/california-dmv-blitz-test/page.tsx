import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import BlitzQuiz from '@/components/BlitzQuiz';
import type { MarathonQuestion } from '@/components/MarathonQuiz';
import QuizViewTracker from '@/components/quiz/QuizViewTracker';
import { getBaseViews } from '@/lib/quiz-base-views';
import quizzesData from '@/data/quizzes.json';

export const metadata: Metadata = {
  title: 'California DMV Blitz Test 2026: 15 Seconds Per Question | DMV California',
  description:
    '20 DMV questions, 15 seconds each. Answer fast to earn speed-bonus points. Miss the timer and it counts wrong. The fastest way to sharpen your reflexes before the real test.',
  alternates: { canonical: 'https://dmvcalifornia.us/california-dmv-blitz-test' },
  openGraph: { title: 'California DMV Blitz Test 2026', type: 'website' },
};

function buildPool(): MarathonQuestion[] {
  const seen = new Set<string>();
  const pool: MarathonQuestion[] = [];
  for (const quiz of quizzesData.quizzes as any[]) {
    if (quiz.language && quiz.language !== 'en') continue;
    for (const q of quiz.questions || []) {
      if (q.image) continue;
      if (!Array.isArray(q.options) || q.options.length < 2) continue;
      if (typeof q.correctAnswer !== 'number' || q.correctAnswer >= q.options.length) continue;
      const key = q.question.trim().toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      pool.push({
        id: `${quiz.slug}-${q.id}`,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation || '',
      });
    }
  }
  return pool;
}

const pool = buildPool();

export default function BlitzTestPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Hero */}
        <section className="bg-gradient-to-r from-violet-700 to-indigo-600 text-white py-12">
          <div className="container mx-auto px-4 text-center max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
              <span>15 seconds per question</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">DMV Blitz Test</h1>
            <p className="text-white/90 text-lg mb-2">
              20 questions. 15 seconds each. Answer faster to earn more points.
            </p>
            <p className="text-white/70 text-sm mb-5">
              Answer in under 5 seconds: 20 pts. Under 10 seconds: 15 pts. Beat the clock: 10 pts. Miss the timer: 0 pts.
            </p>
            <div className="flex justify-center">
              <QuizViewTracker
                quizId="blitz-test"
                baseViews={getBaseViews('blitz-test')}
                variant="prominent"
              />
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <BlitzQuiz questions={pool} />
          </div>
        </section>

        {/* SEO content */}
        <section className="py-12 bg-white border-t border-gray-100">
          <div className="container mx-auto px-4 max-w-3xl prose prose-gray">
            <h2>What is the DMV blitz test?</h2>
            <p>
              The blitz test picks 20 questions at random from the full California DMV question bank and gives
              you 15 seconds to answer each one. If the timer runs out before you pick, the question is marked
              wrong and you move on. The faster you answer correctly, the more points you earn.
            </p>
            <h2>How is the score calculated?</h2>
            <p>
              Each correct answer earns base points plus a speed bonus. Answer in the first 5 seconds (10 or
              more seconds remaining): 20 points. Answer between 5 and 10 seconds remaining: 15 points. Answer
              in the final 5 seconds: 10 points. Wrong answer or timeout: 0 points. Maximum possible score
              is 400 points.
            </p>
            <h2>Why practice under time pressure?</h2>
            <p>
              The real California DMV written test does not have a per-question timer, but practicing under
              pressure builds pattern recognition — you stop reasoning from scratch on every question and
              start recognizing the right answer quickly. That confidence carries into the actual exam.
            </p>
          </div>
        </section>
      </main>
      <Footer />
      <CookieBanner />
    </>
  );
}
