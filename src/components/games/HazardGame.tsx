'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ElementKind,
  HazardResult,
  HazardScene as HazardSceneType,
  starsForHazardRun,
} from '@/types/hazard';
import HazardScene, { ElementStatus, HazardLegend } from './HazardScene';

interface HazardGameProps {
  scene: HazardSceneType;
  /** Slug of the next scene, or null if this is the last one. */
  nextSceneId: string | null;
}

type GameStatus = 'ready' | 'playing' | 'finished';
type TapState = 'found' | 'wrong';

const RESULTS_KEY = 'hazard-results';

function loadResults(): Record<string, HazardResult> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(RESULTS_KEY);
    return raw ? (JSON.parse(raw) as Record<string, HazardResult>) : {};
  } catch {
    return {};
  }
}

function saveResult(result: HazardResult) {
  if (typeof window === 'undefined') return;
  try {
    const all = loadResults();
    const prev = all[result.sceneId];
    // Keep the best run (most stars, then most hazards found, then fewest wrong taps).
    if (
      !prev ||
      result.stars > prev.stars ||
      (result.stars === prev.stars && result.found > prev.found) ||
      (result.stars === prev.stars && result.found === prev.found && result.wrongTaps < prev.wrongTaps)
    ) {
      all[result.sceneId] = result;
      window.localStorage.setItem(RESULTS_KEY, JSON.stringify(all));
    }
  } catch {
    // localStorage unavailable — fail silently, the game still works in-session.
  }
}

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2, '0')}`;
}

export default function HazardGame({ scene, nextSceneId }: HazardGameProps) {
  const [status, setStatus] = useState<GameStatus>('ready');
  const [timeLeft, setTimeLeft] = useState(scene.timeLimit);
  const [tapped, setTapped] = useState<Record<string, TapState>>({});
  const [savedStars, setSavedStars] = useState<1 | 2 | 3 | null>(null);

  const hazards = useMemo(() => scene.elements.filter((e) => e.isHazard), [scene.elements]);
  const totalHazards = hazards.length;

  const kindsPresent = useMemo(() => {
    const set = new Set<ElementKind>();
    for (const el of scene.elements) set.add(el.kind);
    return Array.from(set);
  }, [scene.elements]);

  const foundCount = scene.elements.filter((e) => e.isHazard && tapped[e.id] === 'found').length;
  const wrongCount = scene.elements.filter((e) => tapped[e.id] === 'wrong').length;

  const finishGame = useCallback(() => {
    setStatus((prev) => (prev === 'playing' ? 'finished' : prev));
  }, []);

  // Countdown — only ticks while playing. Re-runs once per second.
  useEffect(() => {
    if (status !== 'playing') return;
    if (timeLeft <= 0) {
      finishGame();
      return;
    }
    const id = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [status, timeLeft, finishGame]);

  // Score + persist once, when the game finishes.
  useEffect(() => {
    if (status !== 'finished' || savedStars !== null) return;
    const found = scene.elements.filter((e) => e.isHazard && tapped[e.id] === 'found').length;
    const wrong = scene.elements.filter((e) => tapped[e.id] === 'wrong').length;
    const stars = starsForHazardRun(found, totalHazards, wrong);
    setSavedStars(stars);
    saveResult({
      sceneId: scene.id,
      stars,
      found,
      total: totalHazards,
      wrongTaps: wrong,
      solvedAt: new Date().toISOString(),
    });
  }, [status, savedStars, tapped, scene, totalHazards]);

  const elementStatus = useMemo(() => {
    const map: Record<string, ElementStatus> = {};
    for (const el of scene.elements) {
      const t = tapped[el.id];
      if (t === 'found') map[el.id] = 'found';
      else if (t === 'wrong') map[el.id] = 'wrong';
      else if (status === 'finished' && el.isHazard) map[el.id] = 'missed';
      else map[el.id] = 'idle';
    }
    return map;
  }, [scene.elements, tapped, status]);

  function handleTap(id: string) {
    if (status !== 'playing' || tapped[id]) return;
    const el = scene.elements.find((e) => e.id === id);
    if (!el) return;

    const next: Record<string, TapState> = {
      ...tapped,
      [id]: el.isHazard ? 'found' : 'wrong',
    };
    setTapped(next);

    if (el.isHazard) {
      const found = scene.elements.filter((e) => e.isHazard && next[e.id] === 'found').length;
      if (found === totalHazards) finishGame();
    }
  }

  function startGame() {
    setStatus('playing');
  }

  function retry() {
    setTapped({});
    setTimeLeft(scene.timeLimit);
    setSavedStars(null);
    setStatus('playing');
  }

  const allFound = foundCount === totalHazards;
  const cleanRun = allFound && wrongCount === 0;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Scene */}
      <div className="bg-gray-50 p-4 md:p-6 relative">
        <HazardScene
          setting={scene.setting}
          elements={scene.elements}
          elementStatus={elementStatus}
          onElementTap={handleTap}
          disabled={status !== 'playing'}
        />

        {/* Pre-game cover — keeps the player from pre-scanning before the clock starts */}
        {status === 'ready' && (
          <div className="absolute inset-0 bg-gray-900/95 flex flex-col items-center justify-center text-center p-6">
            <div className="text-5xl mb-3" aria-hidden>👀</div>
            <h3 className="text-white text-xl font-bold mb-2">{scene.title}</h3>
            <p className="text-gray-300 text-sm mb-2 max-w-sm">{scene.description}</p>
            <p className="text-amber-300 text-sm font-semibold mb-5">
              {totalHazards} hazards · {scene.timeLimit} seconds
            </p>
            <button
              onClick={startGame}
              type="button"
              className="bg-primary hover:bg-primary-600 text-white font-bold py-3 px-8 rounded-lg transition-colors"
            >
              Start scanning →
            </button>
          </div>
        )}
      </div>

      {/* Legend — always visible so players know what each shape is */}
      <div className="px-4 md:px-6 py-3 bg-gray-50 border-t border-gray-100">
        <p className="text-center text-[11px] uppercase tracking-wide text-gray-400 mb-1.5">
          What&apos;s on the board
        </p>
        <HazardLegend kinds={kindsPresent} />
      </div>

      {/* Status / instruction bar */}
      <div className="p-5 md:p-6">
        {status !== 'finished' && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl" aria-hidden>⏱</span>
                <span
                  className={[
                    'text-2xl font-bold tabular-nums',
                    status === 'playing' && timeLeft <= 5 ? 'text-red-600' : 'text-gray-900',
                  ].join(' ')}
                >
                  {formatTime(timeLeft)}
                </span>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-primary">
                  {foundCount} / {totalHazards}
                </div>
                <div className="text-xs text-gray-500">hazards found</div>
              </div>
            </div>
            <p className="text-center text-gray-700 text-sm mb-3">
              Tap every developing hazard you can spot before the timer runs out.
            </p>
            <button
              onClick={finishGame}
              type="button"
              disabled={status !== 'playing'}
              className="w-full border-2 border-gray-300 text-gray-700 font-semibold py-2.5 px-4 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              I&apos;m done — lock in my answers
            </button>
          </div>
        )}

        {status === 'finished' && savedStars && (
          <div className="rounded-lg border-2 border-gray-200 bg-gray-50 p-4">
            <div className="text-center mb-4">
              <div className="text-3xl mb-1" aria-label={`${savedStars} out of 3 stars`}>
                {'⭐'.repeat(savedStars)}
                <span className="opacity-25">{'⭐'.repeat(3 - savedStars)}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                {cleanRun ? 'Perfect scan!' : allFound ? 'All hazards found' : "Time's up"}
              </h3>
              <p className="text-sm text-gray-600">
                You found <strong>{foundCount}</strong> of <strong>{totalHazards}</strong> hazards
                {wrongCount > 0 && (
                  <> · <span className="text-red-600">{wrongCount} wrong {wrongCount === 1 ? 'tap' : 'taps'}</span></>
                )}
              </p>
            </div>

            {/* Hazard reveal */}
            <div className="bg-white rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-gray-900 mb-2 text-sm">Every hazard in this scene:</h4>
              <ul className="space-y-2">
                {hazards.map((e) => {
                  const got = tapped[e.id] === 'found';
                  return (
                    <li key={e.id} className="flex gap-2 text-sm">
                      <span
                        className={[
                          'flex-shrink-0 w-5 h-5 rounded-full text-white text-xs font-bold flex items-center justify-center',
                          got ? 'bg-green-600' : 'bg-amber-500',
                        ].join(' ')}
                        aria-hidden
                      >
                        {got ? '✓' : '!'}
                      </span>
                      <span className="text-gray-700">
                        <strong className="text-gray-900">{e.hazardLabel}</strong>
                        {got ? '' : ' (missed)'} — {e.hazardWhy}
                      </span>
                    </li>
                  );
                })}
              </ul>
              {scene.reference && (
                <p className="text-gray-400 text-xs mt-3">{scene.reference}</p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={retry}
                type="button"
                className="flex-1 border-2 border-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-lg hover:bg-white transition-colors"
              >
                Replay
              </button>
              {nextSceneId ? (
                <Link
                  href={`/eyes-on-the-road/${nextSceneId}`}
                  className="flex-1 bg-primary hover:bg-primary-600 text-white font-bold py-3 px-4 rounded-lg text-center transition-colors"
                >
                  Next Scene →
                </Link>
              ) : (
                <Link
                  href="/eyes-on-the-road"
                  className="flex-1 bg-primary hover:bg-primary-600 text-white font-bold py-3 px-4 rounded-lg text-center transition-colors"
                >
                  All Scenes
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
