'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { RefreshCw, Trophy } from 'lucide-react';
import { todaySignMatch } from '@/lib/signMatchDaily';
import {
  percentageFromMoves,
  starsForSignMatch,
  type SignMatchCard,
  type SignMatchResult,
} from '@/types/signMatch';

export type SignMatchState = 'playing' | 'won';

interface Props {
  onGameStateChange?: (state: SignMatchState, result: SignMatchResult | null) => void;
}

export default function SignMatchGame({ onGameStateChange }: Props) {
  const board = useMemo(() => todaySignMatch(), []);
  const [cards] = useState<SignMatchCard[]>(board.cards);
  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [moves, setMoves] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [busy, setBusy] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [state, setState] = useState<SignMatchState>('playing');
  const startRef = useRef(Date.now());

  useEffect(() => {
    if (state !== 'playing') return;
    const interval = setInterval(() => setElapsedMs(Date.now() - startRef.current), 250);
    return () => clearInterval(interval);
  }, [state]);

  const handleFlip = (card: SignMatchCard) => {
    if (busy || flipped.includes(card.cardId) || matched.has(card.signId)) return;
    if (flipped.length === 2) return;

    const next = [...flipped, card.cardId];
    setFlipped(next);

    if (next.length === 2) {
      setBusy(true);
      setMoves((m) => m + 1);
      const [firstId, secondId] = next;
      const first = cards.find((c) => c.cardId === firstId)!;
      const second = cards.find((c) => c.cardId === secondId)!;

      if (first.signId === second.signId) {
        setTimeout(() => {
          setMatched((prev) => {
            const nextMatched = new Set(prev).add(first.signId);
            if (nextMatched.size === board.pairs) {
              const elapsed = Date.now() - startRef.current;
              const totalMoves = moves + 1;
              const totalMistakes = mistakes;
              const result: SignMatchResult = {
                moves: totalMoves,
                mistakes: totalMistakes,
                pairs: board.pairs,
                stars: starsForSignMatch(board.pairs, totalMistakes),
                elapsedMs: elapsed,
                completedAt: new Date().toISOString(),
              };
              setState('won');
              onGameStateChange?.('won', result);
            }
            return nextMatched;
          });
          setFlipped([]);
          setBusy(false);
        }, 500);
      } else {
        setMistakes((m) => m + 1);
        setTimeout(() => {
          setFlipped([]);
          setBusy(false);
        }, 900);
      }
    }
  };

  const seconds = Math.floor(elapsedMs / 1000);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="text-sm text-gray-500">
          <span className="font-bold text-gray-900 tabular-nums">{moves}</span> moves
        </div>
        <div className="text-sm text-gray-500 tabular-nums">
          {String(Math.floor(seconds / 60)).padStart(2, '0')}:{String(seconds % 60).padStart(2, '0')}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {cards.map((card) => {
          const isFlipped = flipped.includes(card.cardId) || matched.has(card.signId);
          const isMatched = matched.has(card.signId);
          return (
            <button
              key={card.cardId}
              type="button"
              onClick={() => handleFlip(card)}
              disabled={isFlipped}
              className={`sign-match-card aspect-square rounded-lg border-2 transition-colors ${
                isMatched
                  ? 'border-green-400 bg-green-50'
                  : isFlipped
                  ? 'border-primary bg-white'
                  : 'border-gray-200 bg-primary hover:bg-primary-600 cursor-pointer'
              } ${isFlipped ? 'is-flipped' : ''}`}
            >
              {isFlipped ? (
                card.kind === 'image' ? (
                  <div className="relative w-full h-full p-1.5">
                    <Image
                      src={card.image!}
                      alt="California road sign"
                      fill
                      sizes="120px"
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <span className="flex items-center justify-center w-full h-full text-sm sm:text-base font-semibold text-gray-800 text-center px-2.5 leading-snug">
                    {card.meaning}
                  </span>
                )
              ) : (
                <span className="flex items-center justify-center w-full h-full text-white/70 text-3xl font-bold">?</span>
              )}
            </button>
          );
        })}
      </div>

      {state === 'won' && (
        <div className="mt-5 text-center">
          <div className="inline-flex items-center gap-2 text-green-600 font-bold">
            <Trophy className="w-5 h-5" />
            Solved in {moves} moves
          </div>
        </div>
      )}

      <p className="mt-4 text-center text-xs text-gray-400 flex items-center justify-center gap-1.5">
        <RefreshCw className="w-3 h-3" /> A new board every day &middot; comes back tomorrow
      </p>

      <style jsx global>{`
        @keyframes sign-flip {
          0% { transform: scale(0.94); opacity: 0.6; }
          100% { transform: scale(1); opacity: 1; }
        }
        .sign-match-card.is-flipped {
          animation: sign-flip 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
