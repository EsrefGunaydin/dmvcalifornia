'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import QuizViewTracker from '@/components/quiz/QuizViewTracker';
import SignMatchGame, { type SignMatchState } from '@/components/games/SignMatchGame';
import SignMatchScoreboard from '@/components/games/SignMatchScoreboard';
import { useStreak } from '@/hooks/useStreak';
import { signMatchQuizId, signMatchDailyIndex, todaySignMatch } from '@/lib/signMatchDaily';
import { getBaseViews } from '@/lib/quiz-base-views';
import type { SignMatchResult } from '@/types/signMatch';

export default function SignMatchContent() {
  const [gameState, setGameState] = useState<SignMatchState>('playing');
  const [moves, setMoves] = useState(0);
  const { recordStudy } = useStreak();

  const { quizId, pairs } = todaySignMatch();
  const dayIndex = signMatchDailyIndex();

  const handleGameStateChange = (state: SignMatchState, result: SignMatchResult | null) => {
    setGameState(state);
    if (result) {
      setMoves(result.moves);
      recordStudy();
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'sign_match_complete', {
          quiz_id: quizId,
          moves: result.moves,
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
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Road Sign Memory Match</h1>
            <p className="text-white/85 text-sm mb-4">
              Flip cards to match each California road sign with its meaning. Same 8 signs for
              everyone today, straight from the real DMV sign test.
            </p>
            <div className="flex flex-wrap gap-2 justify-center text-xs">
              <span className="bg-white/20 px-3 py-1.5 rounded-full">Daily board</span>
              <span className="bg-white/20 px-3 py-1.5 rounded-full">Real DMV signs</span>
              <span className="bg-white/20 px-3 py-1.5 rounded-full">Free · no signup</span>
            </div>
          </div>
        </div>
      </section>

      <main className="flex-1 flex flex-col lg:flex-row items-start justify-center gap-0 lg:gap-8 px-4 pt-6 pb-12 max-w-4xl mx-auto w-full">
        <div className="flex-1 flex justify-center bg-white rounded-2xl border border-gray-100 shadow-sm py-6 px-3 w-full lg:w-auto">
          <SignMatchGame onGameStateChange={handleGameStateChange} />
        </div>

        <div className="w-full lg:w-72 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mt-4 lg:mt-0">
          <SignMatchScoreboard
            quizId={quizId}
            dayIndex={dayIndex}
            gameState={gameState}
            moves={moves}
            pairs={pairs}
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
