'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { GameResult, IntersectionLevel } from '@/types/intersection';

interface IntersectionLevelGridProps {
  levels: IntersectionLevel[];
}

const RESULTS_KEY = 'intersection-results';

export default function IntersectionLevelGrid({ levels }: IntersectionLevelGridProps) {
  const [results, setResults] = useState<Record<string, GameResult>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(RESULTS_KEY);
      if (raw) setResults(JSON.parse(raw) as Record<string, GameResult>);
    } catch {
      // ignore — treat as no progress
    }
    setHydrated(true);
  }, []);

  const solvedCount = Object.keys(results).length;

  return (
    <div>
      {/* Progress summary */}
      {hydrated && solvedCount > 0 && (
        <div className="mb-6 text-center">
          <p className="text-gray-700">
            <span className="font-bold text-primary">{solvedCount}</span> of {levels.length} intersections cleared
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {levels.map((lvl, idx) => {
          const result = results[lvl.id];
          const solved = !!result;
          // Before hydration assume only level 1 is unlocked (matches a fresh visitor);
          // after hydration, a level is unlocked if it's the first or the previous one is solved.
          const prevSolved = idx === 0 || !!results[levels[idx - 1].id];
          const unlocked = hydrated ? idx === 0 || prevSolved : idx === 0;
          const levelNumber = idx + 1;

          const card = (
            <div
              className={[
                'h-full rounded-xl border-2 p-5 transition-shadow',
                unlocked
                  ? 'bg-white border-gray-200 hover:shadow-xl group cursor-pointer'
                  : 'bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed',
              ].join(' ')}
            >
              <div className="flex items-center justify-between mb-3">
                <span
                  className={[
                    'px-2.5 py-1 rounded-full text-xs font-bold',
                    solved ? 'bg-green-100 text-green-700' : 'bg-primary/10 text-primary',
                  ].join(' ')}
                >
                  Level {levelNumber}
                </span>
                {!unlocked && <span className="text-gray-400" aria-label="Locked">🔒</span>}
                {solved && result && (
                  <span aria-label={`${result.stars} of 3 stars`} className="text-sm">
                    {'⭐'.repeat(result.stars)}
                    <span className="opacity-25">{'⭐'.repeat(3 - result.stars)}</span>
                  </span>
                )}
              </div>
              <h3
                className={[
                  'text-lg font-bold mb-1',
                  unlocked ? 'text-gray-900 group-hover:text-primary transition-colors' : 'text-gray-500',
                ].join(' ')}
              >
                {lvl.title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2">{lvl.description}</p>
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-500 capitalize">
                  {lvl.intersectionType.replace(/-/g, ' ')}
                </span>
                {unlocked && (
                  <span className="text-primary font-semibold text-sm">
                    {solved ? 'Replay' : 'Play'} →
                  </span>
                )}
              </div>
            </div>
          );

          return unlocked ? (
            <Link key={lvl.id} href={`/intersection/${lvl.id}`} className="block h-full">
              {card}
            </Link>
          ) : (
            <div key={lvl.id} className="h-full" aria-disabled>
              {card}
            </div>
          );
        })}
      </div>
    </div>
  );
}
