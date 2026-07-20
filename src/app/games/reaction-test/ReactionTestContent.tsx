'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import QuizViewTracker from '@/components/quiz/QuizViewTracker';
import ReactionTest, { type ReactionState } from '@/components/games/ReactionTest';
import ReactionScoreboard from '@/components/games/ReactionScoreboard';
import { useStreak } from '@/hooks/useStreak';
import { todayReactionQuizId, reactionDailyIndex } from '@/lib/reactionDaily';
import { getBaseViews } from '@/lib/quiz-base-views';
import type { ReactionResult } from '@/types/reaction';

export default function ReactionTestContent() {
  const [gameState, setGameState] = useState<ReactionState>('playing');
  const [averageMs, setAverageMs] = useState(0);
  const { recordStudy } = useStreak();

  const quizId = todayReactionQuizId();
  const dayIndex = reactionDailyIndex();

  const handleGameStateChange = (state: ReactionState, result: ReactionResult | null) => {
    setGameState(state);
    if (result) {
      setAverageMs(result.averageMs);
      recordStudy();
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'reaction_test_complete', {
          quiz_id: quizId,
          average_ms: result.averageMs,
          false_starts: result.falseStarts,
          stars: result.stars,
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <section className="bg-gradient-to-r from-primary to-primary-600 text-white py-7">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Brake Reaction Test</h1>
            <p className="text-white/85 text-sm mb-4">
              Five rounds. Tap the instant it turns green. See what your reaction time actually
              costs you in stopping distance.
            </p>
            <div className="flex flex-wrap gap-2 justify-center text-xs">
              <span className="bg-white/20 px-3 py-1.5 rounded-full">Daily leaderboard</span>
              <span className="bg-white/20 px-3 py-1.5 rounded-full">Real stopping-distance math</span>
              <span className="bg-white/20 px-3 py-1.5 rounded-full">Free · no signup</span>
            </div>
          </div>
        </div>
      </section>

      <main className="flex-1 flex flex-col lg:flex-row items-start justify-center gap-0 lg:gap-8 px-4 pt-6 pb-12 max-w-4xl mx-auto w-full">
        <div className="flex-1 flex justify-center bg-white rounded-2xl border border-gray-100 shadow-sm py-6 px-3 w-full lg:w-auto">
          <ReactionTest onGameStateChange={handleGameStateChange} />
        </div>

        <div className="w-full lg:w-72 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mt-4 lg:mt-0">
          <ReactionScoreboard
            quizId={quizId}
            dayIndex={dayIndex}
            gameState={gameState}
            averageMs={averageMs}
          />
        </div>
      </main>

      <div className="text-center pb-6">
        <QuizViewTracker quizId={quizId} baseViews={getBaseViews(quizId)} />
      </div>

      <Footer />
      <CookieBanner />
    </div>
  );
}
