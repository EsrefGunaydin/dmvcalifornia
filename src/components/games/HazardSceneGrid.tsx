'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { HazardResult, HazardScene } from '@/types/hazard';

interface HazardSceneGridProps {
  scenes: HazardScene[];
}

const RESULTS_KEY = 'hazard-results';

export default function HazardSceneGrid({ scenes }: HazardSceneGridProps) {
  const [results, setResults] = useState<Record<string, HazardResult>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(RESULTS_KEY);
      if (raw) setResults(JSON.parse(raw) as Record<string, HazardResult>);
    } catch {
      // ignore — treat as no progress
    }
    setHydrated(true);
  }, []);

  const clearedCount = Object.keys(results).length;

  return (
    <div>
      {/* Progress summary */}
      {hydrated && clearedCount > 0 && (
        <div className="mb-6 text-center">
          <p className="text-gray-700">
            <span className="font-bold text-primary">{clearedCount}</span> of {scenes.length} scenes played
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {scenes.map((scene, idx) => {
          const result = results[scene.id];
          const played = !!result;
          // Before hydration assume only scene 1 is unlocked (matches a fresh visitor);
          // after hydration, a scene is unlocked if it's the first or the previous one was played.
          const prevPlayed = idx === 0 || !!results[scenes[idx - 1].id];
          const unlocked = hydrated ? idx === 0 || prevPlayed : idx === 0;
          const sceneNumber = idx + 1;
          const hazardCount = scene.elements.filter((e) => e.isHazard).length;

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
                    played ? 'bg-green-100 text-green-700' : 'bg-primary/10 text-primary',
                  ].join(' ')}
                >
                  Scene {sceneNumber}
                </span>
                {!unlocked && <span className="text-gray-400" aria-label="Locked">🔒</span>}
                {played && result && (
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
                {scene.title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2">{scene.description}</p>
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-500 capitalize">
                  {scene.setting.replace(/-/g, ' ')} · {hazardCount} hazards
                </span>
                {unlocked && (
                  <span className="text-primary font-semibold text-sm">
                    {played ? 'Replay' : 'Play'} →
                  </span>
                )}
              </div>
            </div>
          );

          return unlocked ? (
            <Link key={scene.id} href={`/eyes-on-the-road/${scene.id}`} className="block h-full">
              {card}
            </Link>
          ) : (
            <div key={scene.id} className="h-full" aria-disabled>
              {card}
            </div>
          );
        })}
      </div>
    </div>
  );
}
