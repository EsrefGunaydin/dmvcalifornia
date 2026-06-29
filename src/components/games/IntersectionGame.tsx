'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Zap, Star } from 'lucide-react';
import {
  GameResult,
  IntersectionLevel,
  starsForAttempts,
} from '@/types/intersection';
import IntersectionScene, { AgentStatus } from './IntersectionScene';

interface IntersectionGameProps {
  level: IntersectionLevel;
  /** Slug of the next level, or null if this is the last one. */
  nextLevelId: string | null;
}

type GameStatus = 'playing' | 'crashed' | 'complete';

const RESULTS_KEY = 'intersection-results';

function loadResults(): Record<string, GameResult> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(RESULTS_KEY);
    return raw ? (JSON.parse(raw) as Record<string, GameResult>) : {};
  } catch {
    return {};
  }
}

function saveResult(result: GameResult) {
  if (typeof window === 'undefined') return;
  try {
    const all = loadResults();
    const prev = all[result.levelId];
    // Keep the best (most stars, then fewest attempts).
    if (
      !prev ||
      result.stars > prev.stars ||
      (result.stars === prev.stars && result.attempts < prev.attempts)
    ) {
      all[result.levelId] = result;
      window.localStorage.setItem(RESULTS_KEY, JSON.stringify(all));
    }
  } catch {
    // localStorage unavailable — fail silently, the game still works in-session.
  }
}

export default function IntersectionGame({ level, nextLevelId }: IntersectionGameProps) {
  const [tappedOrder, setTappedOrder] = useState<string[]>([]);
  const [status, setStatus] = useState<GameStatus>('playing');
  const [attempts, setAttempts] = useState(0);
  const [crashInfo, setCrashInfo] = useState<{ rule: string } | null>(null);
  const [savedStars, setSavedStars] = useState<1 | 2 | 3 | null>(null);

  const totalAgents = level.agents.length;

  // Derive per-agent status + badge numbers from the current tap order.
  const { agentStatus, agentBadge } = useMemo(() => {
    const statusMap: Record<string, AgentStatus> = {};
    const badgeMap: Record<string, number> = {};
    for (const agent of level.agents) {
      statusMap[agent.id] = 'idle';
    }
    tappedOrder.forEach((id, idx) => {
      badgeMap[id] = idx + 1;
      statusMap[id] = status === 'crashed' && idx === tappedOrder.length - 1 ? 'crashed' : 'going';
    });
    if (status === 'complete') {
      for (const id of tappedOrder) statusMap[id] = 'going';
    }
    return { agentStatus: statusMap, agentBadge: badgeMap };
  }, [level.agents, tappedOrder, status]);

  function handleTap(agentId: string) {
    if (status !== 'playing') return;

    const step = tappedOrder.length;
    const expected = level.correctOrder[step];

    if (agentId === expected) {
      const next = [...tappedOrder, agentId];
      setTappedOrder(next);
      if (next.length === level.correctOrder.length) {
        // Solved.
        const stars = starsForAttempts(attempts);
        setStatus('complete');
        setSavedStars(stars);
        saveResult({
          levelId: level.id,
          stars,
          attempts,
          solvedAt: new Date().toISOString(),
        });
      }
      return;
    }

    // Wrong tap — collision.
    const ruleKey = `${agentId}>${expected}`;
    const rule = level.collisionRules[ruleKey] ?? level.collisionRules['*'] ?? 'That vehicle does not have the right of way yet.';
    setTappedOrder([...tappedOrder, agentId]); // briefly show the bad pick
    setCrashInfo({ rule });
    setStatus('crashed');
    setAttempts((a) => a + 1);
  }

  function retry() {
    setTappedOrder([]);
    setCrashInfo(null);
    setStatus('playing');
  }

  const orderedForRecap = level.correctOrder;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Scene */}
      <div className="bg-gray-50 p-4 md:p-6">
        <IntersectionScene
          intersectionType={level.intersectionType}
          agents={level.agents}
          agentStatus={agentStatus}
          agentBadge={agentBadge}
          onAgentTap={handleTap}
          disabled={status !== 'playing'}
        />
      </div>

      {/* Status / instruction bar */}
      <div className="p-5 md:p-6">
        {status === 'playing' && (
          <div className="text-center">
            <p className="text-gray-700">
              Tap the road users in the order they may legally proceed.
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {tappedOrder.length} of {totalAgents} chosen
            </p>
          </div>
        )}

        {status === 'crashed' && crashInfo && (
          <div className="rounded-lg border-2 border-red-200 bg-red-50 p-4">
            <div className="flex items-start gap-3">
              <Zap className="w-6 h-6 text-red-600 flex-shrink-0" aria-hidden />
              <div className="flex-1">
                <h3 className="font-bold text-red-700 mb-1">Collision — wrong order</h3>
                <p className="text-red-800 text-sm leading-relaxed">{crashInfo.rule}</p>
                {level.cvcReference && (
                  <p className="text-red-500 text-xs mt-2">{level.cvcReference}</p>
                )}
              </div>
            </div>
            <button
              onClick={retry}
              type="button"
              className="mt-4 w-full bg-primary hover:bg-primary-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {status === 'complete' && savedStars && (
          <div className="rounded-lg border-2 border-green-200 bg-green-50 p-4">
            <div className="text-center mb-4">
              <div className="inline-flex items-center mb-1" aria-label={`${savedStars} out of 3 stars`}>
                {Array.from({ length: savedStars }, (_, i) => <Star key={i} className="w-6 h-6 text-yellow-400 fill-yellow-400" />)}
                <span className="opacity-25 inline-flex">{Array.from({ length: 3 - savedStars }, (_, i) => <Star key={i} className="w-6 h-6 text-yellow-400 fill-yellow-400" />)}</span>
              </div>
              <h3 className="text-xl font-bold text-green-800">Intersection cleared!</h3>
              <p className="text-sm text-green-700">
                {attempts === 0
                  ? 'Perfect — solved on the first try.'
                  : `Solved after ${attempts} ${attempts === 1 ? 'mistake' : 'mistakes'}.`}
              </p>
            </div>

            {/* Rule recap */}
            <div className="bg-white rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-gray-900 mb-2 text-sm">Why this is the order:</h4>
              <ol className="space-y-2">
                {orderedForRecap.map((id, idx) => {
                  const agent = level.agents.find((a) => a.id === id);
                  return (
                    <li key={id} className="flex gap-2 text-sm">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-600 text-white text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-gray-700">
                        <strong className="text-gray-900 capitalize">
                          {agent?.type ?? id}
                        </strong>{' '}
                        — {level.stepRules[id]}
                      </span>
                    </li>
                  );
                })}
              </ol>
              {level.cvcReference && (
                <p className="text-gray-400 text-xs mt-3">{level.cvcReference}</p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={retry}
                type="button"
                className="flex-1 border-2 border-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Replay
              </button>
              {nextLevelId ? (
                <Link
                  href={`/intersection/${nextLevelId}`}
                  className="flex-1 bg-primary hover:bg-primary-600 text-white font-bold py-3 px-4 rounded-lg text-center transition-colors"
                >
                  Next Level →
                </Link>
              ) : (
                <Link
                  href="/intersection"
                  className="flex-1 bg-primary hover:bg-primary-600 text-white font-bold py-3 px-4 rounded-lg text-center transition-colors"
                >
                  All Levels
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
