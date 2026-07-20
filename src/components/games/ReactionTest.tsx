'use client';

import { useEffect, useRef, useState } from 'react';
import { Zap, AlertTriangle, Trophy } from 'lucide-react';
import {
  ROUNDS_PER_GAME,
  FALSE_START_PENALTY_MS,
  starsForReaction,
  stoppingDistanceFeet,
  type ReactionResult,
  type ReactionRound,
} from '@/types/reaction';

export type ReactionState = 'playing' | 'finished';

type Phase = 'intro' | 'waiting' | 'go' | 'result' | 'finished';

interface Props {
  onGameStateChange?: (state: ReactionState, result: ReactionResult | null) => void;
}

const SPEEDS_MPH = [25, 45, 65];

function randomDelayMs() {
  return 1500 + Math.random() * 2500;
}

export default function ReactionTest({ onGameStateChange }: Props) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [round, setRound] = useState(1);
  const [rounds, setRounds] = useState<ReactionRound[]>([]);
  const [lastRound, setLastRound] = useState<ReactionRound | null>(null);
  const goTimeRef = useRef<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  const scheduleGo = () => {
    setPhase('waiting');
    timeoutRef.current = setTimeout(() => {
      goTimeRef.current = Date.now();
      setPhase('go');
    }, randomDelayMs());
  };

  const startGame = () => {
    setRounds([]);
    setRound(1);
    scheduleGo();
  };

  const finishGame = (allRounds: ReactionRound[]) => {
    const successful = allRounds.filter((r) => !r.falseStart);
    const falseStarts = allRounds.length - successful.length;
    const averageMs = Math.round(
      allRounds.reduce((sum, r) => sum + r.reactionMs, 0) / allRounds.length,
    );
    const bestMs = successful.length > 0 ? Math.min(...successful.map((r) => r.reactionMs)) : FALSE_START_PENALTY_MS;
    const result: ReactionResult = {
      rounds: allRounds,
      averageMs,
      bestMs,
      falseStarts,
      stars: starsForReaction(averageMs, falseStarts),
      completedAt: new Date().toISOString(),
    };
    setPhase('finished');
    onGameStateChange?.('finished', result);
  };

  const advance = (thisRound: ReactionRound) => {
    const nextRounds = [...rounds, thisRound];
    setRounds(nextRounds);
    setLastRound(thisRound);
    setPhase('result');
    setTimeout(() => {
      if (nextRounds.length >= ROUNDS_PER_GAME) {
        finishGame(nextRounds);
      } else {
        setRound((r) => r + 1);
        scheduleGo();
      }
    }, 1100);
  };

  const handleTap = () => {
    if (phase === 'waiting') {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      advance({ round, reactionMs: FALSE_START_PENALTY_MS, falseStart: true });
      return;
    }
    if (phase === 'go') {
      const reactionMs = Date.now() - (goTimeRef.current ?? Date.now());
      advance({ round, reactionMs, falseStart: false });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {phase === 'intro' && (
        <div className="text-center py-6">
          <Zap className="w-10 h-10 text-primary mx-auto mb-3" />
          <h2 className="text-lg font-bold text-gray-900 mb-2">5 rounds, one tap each</h2>
          <p className="text-sm text-gray-500 mb-6 px-4">
            The box turns green at a random moment. Tap as fast as you can. Tap too early and it
            counts as a false start.
          </p>
          <button
            type="button"
            onClick={startGame}
            className="bg-primary hover:bg-primary-600 text-white font-bold px-8 py-3 rounded-lg transition-colors"
          >
            Start test
          </button>
        </div>
      )}

      {(phase === 'waiting' || phase === 'go') && (
        <div>
          <p className="text-center text-xs text-gray-400 mb-3">Round {round} of {ROUNDS_PER_GAME}</p>
          <button
            type="button"
            onClick={handleTap}
            className={`w-full aspect-video rounded-2xl flex items-center justify-center text-white font-bold text-xl transition-colors select-none ${
              phase === 'go' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500'
            }`}
          >
            {phase === 'go' ? 'TAP NOW!' : 'Wait...'}
          </button>
        </div>
      )}

      {phase === 'result' && lastRound && (
        <div className="w-full aspect-video rounded-2xl flex flex-col items-center justify-center bg-gray-100">
          {lastRound.falseStart ? (
            <>
              <AlertTriangle className="w-8 h-8 text-amber-500 mb-2" />
              <p className="font-bold text-amber-600">Too soon!</p>
              <p className="text-xs text-gray-500 mt-1">Wait for green next time</p>
            </>
          ) : (
            <>
              <p className="text-3xl font-black text-gray-900 tabular-nums">{lastRound.reactionMs}ms</p>
              <p className="text-xs text-gray-500 mt-1">Round {lastRound.round} of {ROUNDS_PER_GAME}</p>
            </>
          )}
        </div>
      )}

      {phase === 'finished' && (
        <FinishedSummary rounds={rounds} />
      )}
    </div>
  );
}

function FinishedSummary({ rounds }: { rounds: ReactionRound[] }) {
  const successful = rounds.filter((r) => !r.falseStart);
  const falseStarts = rounds.length - successful.length;
  const averageMs = Math.round(rounds.reduce((sum, r) => sum + r.reactionMs, 0) / rounds.length);
  const bestMs = successful.length > 0 ? Math.min(...successful.map((r) => r.reactionMs)) : null;

  return (
    <div className="text-center">
      <Trophy className="w-8 h-8 text-primary mx-auto mb-2" />
      <p className="text-3xl font-black text-gray-900 tabular-nums">{averageMs}ms</p>
      <p className="text-sm text-gray-500 mb-1">average reaction time</p>
      {bestMs !== null && (
        <p className="text-xs text-gray-400 mb-4">Best: {bestMs}ms{falseStarts > 0 ? ` · ${falseStarts} false start${falseStarts > 1 ? 's' : ''}` : ''}</p>
      )}

      <div className="mt-4 bg-gray-50 rounded-xl p-4 text-left">
        <p className="text-xs font-semibold text-gray-700 mb-2">
          At your reaction speed, here&apos;s how far your car travels before you even touch the brake:
        </p>
        <div className="flex flex-col gap-1.5">
          {SPEEDS_MPH.map((mph) => (
            <div key={mph} className="flex items-center justify-between text-sm">
              <span className="text-gray-500">{mph} mph</span>
              <span className="font-bold text-gray-900 tabular-nums">
                {stoppingDistanceFeet(mph, averageMs)} ft
              </span>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-gray-400 mt-3 leading-relaxed">
          This is a simple reflex test, not full driving reaction time. On the road, perception and
          decision-making add roughly 1.5 seconds on average before your foot even moves.
        </p>
      </div>

      <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs text-left">
        {rounds.map((r, i) => (
          <span
            key={i}
            className={`px-2.5 py-1 rounded-full tabular-nums ${
              r.falseStart ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'
            }`}
          >
            {r.falseStart ? 'false start' : `${r.reactionMs}ms`}
          </span>
        ))}
      </div>
    </div>
  );
}
