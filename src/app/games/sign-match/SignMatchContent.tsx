'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import QuizViewTracker from '@/components/quiz/QuizViewTracker';
import AppPromotion from '@/components/AppPromotion';
import MultiplexAd from '@/components/MultiplexAd';
import GamesCrossPromo from '@/components/games/GamesCrossPromo';
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

      <main className="container mx-auto px-4 py-6 flex-1">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-gray-600 max-w-4xl mx-auto">
          <ol className="flex items-center gap-2">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li aria-hidden>/</li>
            <li><Link href="/games" className="hover:text-primary">Games</Link></li>
            <li aria-hidden>/</li>
            <li className="text-gray-900 font-medium">Road Sign Memory Match</li>
          </ol>
        </nav>

        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <QuizViewTracker quizId={quizId} baseViews={getBaseViews(quizId)} variant="prominent" label="times played today" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
            <div>
              <div className="flex justify-center bg-white rounded-2xl border border-gray-100 shadow-sm py-6 px-3">
                <SignMatchGame onGameStateChange={handleGameStateChange} />
              </div>
              <div className="mt-6">
                <MultiplexAd />
              </div>
            </div>

            <aside className="space-y-4">
              <div className="sticky top-24 space-y-4">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <SignMatchScoreboard
                    quizId={quizId}
                    dayIndex={dayIndex}
                    gameState={gameState}
                    moves={moves}
                    pairs={pairs}
                  />
                </div>

                <AppPromotion variant="sidebar" />

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h2 className="text-base font-bold text-gray-900 mb-2">How to play</h2>
                  <ul className="space-y-1.5 text-sm text-gray-700">
                    <li>• Flip two cards at a time.</li>
                    <li>• Match each sign to its meaning.</li>
                    <li>• A wrong pair just flips back, no penalty besides an extra move.</li>
                    <li>• Fewer moves and mistakes earn more stars.</li>
                  </ul>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h2 className="text-base font-bold text-gray-900 mb-2">Keep practicing</h2>
                  <p className="text-sm text-gray-600 mb-3">
                    Road signs are one of the most-missed categories on the DMV written test. Drill
                    them with our full practice tests.
                  </p>
                  <Link href="/practice-test" className="text-primary font-semibold text-sm hover:underline">
                    Take a practice test →
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>

      </main>

      <GamesCrossPromo currentSlug="sign-match" />

      <Footer />
      <CookieBanner />
    </div>
  );
}
