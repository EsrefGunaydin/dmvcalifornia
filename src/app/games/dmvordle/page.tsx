'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import DMVordle, { type GameState } from '@/components/games/DMVordle';
import DMVordleScoreboard from '@/components/games/DMVordleScoreboard';
import { getDailyIndex } from '@/data/dmvordle-words';

function getQuizId() {
  const now = new Date();
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, '0');
  const d = String(now.getUTCDate()).padStart(2, '0');
  return `dmvordle-${y}-${m}-${d}`;
}

export default function DMVordlePage() {
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

      {/* Two-column layout */}
      <main className="flex-1 flex flex-col lg:flex-row items-start justify-center gap-0 lg:gap-8 px-4 pt-6 pb-12 max-w-4xl mx-auto w-full">

        {/* Game */}
        <div className="flex-1 flex justify-center bg-white rounded-2xl border border-gray-100 shadow-sm py-2">
          <DMVordle onGameStateChange={handleGameStateChange} />
        </div>

        {/* Scoreboard */}
        <div className="w-full lg:w-72 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mt-4 lg:mt-0">
          <DMVordleScoreboard
            quizId={quizId}
            dayIndex={dayIndex}
            gameState={gameState}
            attempts={attempts}
          />
        </div>

      </main>

      <Footer />
      <CookieBanner />
    </div>
  );
}
