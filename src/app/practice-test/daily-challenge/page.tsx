import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import DailyChallengeContent from './DailyChallengeContent';
import RelatedQuizzes from '@/components/quiz/RelatedQuizzes';
import { pickDailyQuestions, seedFromDate, todayPacific, dailyQuizId } from '@/lib/dailyChallenge';
import QuizViewTracker from '@/components/quiz/QuizViewTracker';
import { getBaseViews } from '@/lib/quiz-base-views';
import type { Question, Quiz } from '@/types/quiz';

import quizzesData from '@/data/quizzes.json';

export const revalidate = 3600; // revalidate hourly so the question set refreshes at most once per hour

export function generateMetadata() {
  const date = todayPacific();
  return {
    title: `Daily Challenge ${date} | DMV California`,
    description: '10 fresh DMV practice questions today, same set for every user. How well do you know the California rules?',
  };
}

export default function DailyChallengePage() {
  const date = todayPacific();
  const seed = seedFromDate(date);

  // Only use English questions without images for clean mobile display.
  // quizzes.json holds both English and Spanish quiz entries, so the
  // language check is required here, not just a filter on images.
  const pool: Question[] = (quizzesData.quizzes as Quiz[])
    .filter((q) => ((q as { language?: string }).language || 'en') === 'en')
    .flatMap((q) => q.questions)
    .filter((q) => !q.image);

  const questions = pickDailyQuestions(pool, 10, seed);

  // Cross-links so the daily challenge isn't a dead end (lifts pageviews-per-session)
  const relatedQuizzes = (quizzesData.quizzes as Quiz[])
    .filter((q) => ((q as { language?: string }).language || 'en') === 'en')
    .slice(0, 6)
    .map((q) => ({
      slug: q.slug,
      title: q.title,
      category: q.category,
      questionCount: q.questions.length,
      language: 'en',
    }));

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto mb-10">
            <div className="inline-block bg-primary/10 text-primary text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
              Daily Challenge
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">10 questions for today</h1>
            <p className="text-gray-600 mb-4">
              Same questions for every user on {date}. New set at midnight Pacific time.
            </p>
            <QuizViewTracker
              quizId={dailyQuizId(date)}
              baseViews={getBaseViews(dailyQuizId(date))}
              variant="prominent"
              label="people have taken today's challenge"
            />
          </div>
          <DailyChallengeContent questions={questions} date={date} />
        </div>
        <RelatedQuizzes quizzes={relatedQuizzes} />
      </main>
      <Footer />
      <CookieBanner />
    </>
  );
}
