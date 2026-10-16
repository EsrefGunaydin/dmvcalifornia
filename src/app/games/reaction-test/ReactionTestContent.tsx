'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import QuizViewTracker from '@/components/quiz/QuizViewTracker';
import AppPromotion from '@/components/AppPromotion';
import WordCubesPromo from '@/components/WordCubesPromo';
import MultiplexAd from '@/components/MultiplexAd';
import GamesCrossPromo from '@/components/games/GamesCrossPromo';
import ReactionTest, { type ReactionState } from '@/components/games/ReactionTest';
import ReactionScoreboard from '@/components/games/ReactionScoreboard';
import { useStreak } from '@/hooks/useStreak';
import { todayReactionQuizId, reactionDailyIndex } from '@/lib/reactionDaily';
import { getBaseViews } from '@/lib/quiz-base-views';
import type { ReactionResult } from '@/types/reaction';

export default function ReactionTestContent() {
  const [gameState, setGameState] = useState<ReactionState>('playing');
  const [bestMs, setBestMs] = useState(0);
  const [averageMs, setAverageMs] = useState(0);
  const { recordStudy } = useStreak();

  const quizId = todayReactionQuizId();
  const dayIndex = reactionDailyIndex();

  const handleGameStateChange = (state: ReactionState, result: ReactionResult | null) => {
    setGameState(state);
    if (result) {
      setBestMs(result.bestMs);
      setAverageMs(result.averageMs);
      recordStudy();
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'reaction_test_complete', {
          quiz_id: quizId,
          best_ms: result.bestMs,
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

      <main className="container mx-auto px-4 py-6 flex-1">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-gray-600 max-w-4xl mx-auto">
          <ol className="flex items-center gap-2">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li aria-hidden>/</li>
            <li><Link href="/games" className="hover:text-primary">Games</Link></li>
            <li aria-hidden>/</li>
            <li className="text-gray-900 font-medium">Brake Reaction Test</li>
          </ol>
        </nav>

        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <QuizViewTracker quizId={quizId} baseViews={getBaseViews(quizId)} variant="prominent" label="times played today" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
            <div>
              <div className="flex justify-center bg-white rounded-2xl border border-gray-100 shadow-sm py-6 px-3">
                <ReactionTest onGameStateChange={handleGameStateChange} />
              </div>
              <div className="mt-6">
                <MultiplexAd />
              </div>
            </div>

            <aside className="space-y-4">
              <div className="sticky top-24 space-y-4">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <ReactionScoreboard
                    quizId={quizId}
                    dayIndex={dayIndex}
                    gameState={gameState}
                    bestMs={bestMs}
                    averageMs={averageMs}
                  />
                </div>

                <WordCubesPromo placement="reaction_test" />

                <AppPromotion variant="compact" />

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h2 className="text-base font-bold text-gray-900 mb-2">How to play</h2>
                  <ul className="space-y-1.5 text-sm text-gray-700">
                    <li>• Wait for the box to turn green.</li>
                    <li>• Tap the instant it changes.</li>
                    <li>• Tap too early and it&apos;s a false start.</li>
                    <li>• Your best time out of 5 rounds counts.</li>
                  </ul>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h2 className="text-base font-bold text-gray-900 mb-2">Keep practicing</h2>
                  <p className="text-sm text-gray-600 mb-3">
                    Fast reflexes help on the road, but passing the written test takes real DMV
                    knowledge. Drill it with our full practice tests.
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

      <GamesCrossPromo currentSlug="reaction-test" />

      <Footer />
      <CookieBanner />
    </div>
  );
}
