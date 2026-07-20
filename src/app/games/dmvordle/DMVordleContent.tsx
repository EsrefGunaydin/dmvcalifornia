'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import AppPromotion from '@/components/AppPromotion';
import MultiplexAd from '@/components/MultiplexAd';
import GamesCrossPromo from '@/components/games/GamesCrossPromo';
import QuizViewTracker from '@/components/quiz/QuizViewTracker';
import DMVordle, { type GameState } from '@/components/games/DMVordle';
import DMVordleScoreboard from '@/components/games/DMVordleScoreboard';
import { getDailyIndex } from '@/data/dmvordle-words';
import { getBaseViews } from '@/lib/quiz-base-views';

function getQuizId() {
  const now = new Date();
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, '0');
  const d = String(now.getUTCDate()).padStart(2, '0');
  return `dmvordle-${y}-${m}-${d}`;
}

export default function DMVordleContent() {
  const [gameState, setGameState] = useState<GameState>('playing');
  const [attempts, setAttempts] = useState(0);
  const quizId = getQuizId();
  const dayIndex = getDailyIndex();

  const handleGameStateChange = (state: GameState, att: number) => {
    setGameState(state);
    setAttempts(att);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-7">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-2xl md:text-3xl font-bold tracking-widest mb-2">DMVordle</h1>
            <p className="text-white/85 text-sm mb-4">
              Guess the 5-letter DMV word in 6 tries. All words are traffic and driving related. New word every day.
            </p>
            <div className="flex flex-wrap gap-2 justify-center text-xs">
              <span className="bg-white/20 px-3 py-1.5 rounded-full">Daily word</span>
              <span className="bg-white/20 px-3 py-1.5 rounded-full">DMV vocabulary</span>
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
            <li className="text-gray-900 font-medium">DMVordle</li>
          </ol>
        </nav>

        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <QuizViewTracker quizId={quizId} baseViews={getBaseViews(quizId)} variant="prominent" label="times played today" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
            <div>
              <div className="flex justify-center bg-white rounded-2xl border border-gray-100 shadow-sm py-2">
                <DMVordle onGameStateChange={handleGameStateChange} />
              </div>
              <div className="mt-6">
                <MultiplexAd />
              </div>
            </div>

            <aside className="space-y-4">
              <div className="sticky top-24 space-y-4">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <DMVordleScoreboard
                    quizId={quizId}
                    dayIndex={dayIndex}
                    gameState={gameState}
                    attempts={attempts}
                  />
                </div>

                <AppPromotion variant="sidebar" />

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h2 className="text-base font-bold text-gray-900 mb-2">How to play</h2>
                  <ul className="space-y-1.5 text-sm text-gray-700">
                    <li>• Green means the right letter in the right spot.</li>
                    <li>• Yellow means the right letter, wrong spot.</li>
                    <li>• All words are traffic and driving related.</li>
                    <li>• One puzzle a day, same word for everyone.</li>
                  </ul>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h2 className="text-base font-bold text-gray-900 mb-2">Keep practicing</h2>
                  <p className="text-sm text-gray-600 mb-3">
                    Vocabulary is only half the test. Drill real DMV questions with our full
                    practice tests.
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

      <GamesCrossPromo currentSlug="dmvordle" />

      <Footer />
      <CookieBanner />
    </div>
  );
}
