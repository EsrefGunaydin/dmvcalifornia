'use client';

import { useState, useEffect, useRef } from 'react';
import { percentageFromReaction } from '@/types/reaction';

interface ScoreEntry {
  name: string;
  points: number; // best reaction ms, lower is better — the ranking metric
  secondaryPoints?: number; // average ms that day, display-only
}

interface Props {
  quizId: string; // e.g. 'reaction-test-2026-07-20'
  dayIndex: number;
  gameState: 'playing' | 'finished';
  bestMs: number;
  averageMs: number;
}

const MEDALS = ['🥇', '🥈', '🥉'];

export default function ReactionScoreboard({ quizId, dayIndex, gameState, bestMs, averageMs }: Props) {
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [allTime, setAllTime] = useState<ScoreEntry[]>([]);
  const [allTimeLoading, setAllTimeLoading] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [marketingConsent, setMarketingConsent] = useState(true);
  const [submitState, setSubmitState] = useState<'idle' | 'submitting' | 'done'>('idle');
  const idempotencyKeyRef = useRef<string | null>(null);

  const gameEnded = gameState === 'finished';

  useEffect(() => {
    const stored = localStorage.getItem(`reaction-test-ikey-${quizId}`);
    if (stored) {
      idempotencyKeyRef.current = stored;
    } else {
      const k = crypto.randomUUID();
      localStorage.setItem(`reaction-test-ikey-${quizId}`, k);
      idempotencyKeyRef.current = k;
    }
    if (localStorage.getItem(`reaction-test-submitted-${quizId}`)) {
      setSubmitState('done');
    }
  }, [quizId]);

  const fetchScores = async () => {
    try {
      const res = await fetch(`/api/leaderboard?quizId=${encodeURIComponent(quizId)}`, { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      const entries: ScoreEntry[] = (data.leaderboard ?? data.entries ?? []).map((e: { name: string; points: number; secondaryPoints?: number }) => ({
        name: e.name,
        points: e.points,
        secondaryPoints: e.secondaryPoints,
      }));
      setScores(entries);
    } catch {}
    setLoading(false);
  };

  const fetchAllTime = async () => {
    try {
      const res = await fetch('/api/leaderboard?quizIdPrefix=reaction-test-', { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      const entries: ScoreEntry[] = (data.leaderboard ?? []).map((e: { name: string; points: number }) => ({
        name: e.name,
        points: e.points,
      }));
      setAllTime(entries);
    } catch {}
    setAllTimeLoading(false);
  };

  useEffect(() => {
    fetchScores();
    fetchAllTime();
    const interval = setInterval(() => {
      fetchScores();
      fetchAllTime();
    }, 30000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || submitState !== 'idle') return;
    setSubmitState('submitting');
    try {
      await fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizId,
          name: name.trim(),
          email: email.trim(),
          marketingConsent,
          percentage: percentageFromReaction(bestMs),
          points: bestMs,
          secondaryPoints: averageMs,
          completedAt: new Date().toISOString(),
          idempotencyKey: idempotencyKeyRef.current,
        }),
      });
      localStorage.setItem(`reaction-test-submitted-${quizId}`, '1');
      setScores((prev) => {
        const entry: ScoreEntry = { name: name.trim(), points: bestMs, secondaryPoints: averageMs };
        return [...prev, entry].sort((a, b) => a.points - b.points);
      });
      setSubmitState('done');
      setTimeout(() => {
        fetchScores();
        fetchAllTime();
      }, 800);
    } catch {
      setSubmitState('idle');
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Today&apos;s Fastest</h2>
        <span className="text-xs text-gray-400">#{dayIndex}</span>
      </div>

      <div className="flex flex-col gap-1 min-h-[100px]">
        {loading ? (
          <p className="text-xs text-gray-400 italic">Loading...</p>
        ) : scores.length === 0 ? (
          <p className="text-xs text-gray-400 italic">No scores yet today. Be the first!</p>
        ) : (
          <>
            <div className="flex items-center gap-2 pb-1 text-[10px] uppercase tracking-wide text-gray-400">
              <span className="w-6" />
              <span className="flex-1">Name</span>
              <span className="w-12 text-right">Best</span>
              <span className="w-12 text-right">Avg</span>
            </div>
            {scores.slice(0, 10).map((s, i) => (
              <div key={i} className="flex items-center gap-2 py-1.5 border-b border-gray-100 last:border-0">
                <span className="text-sm w-6 text-center">{MEDALS[i] ?? <span className="text-xs text-gray-400">{i + 1}</span>}</span>
                <span className="text-sm text-gray-800 font-medium flex-1 truncate">{s.name}</span>
                <span className="text-xs font-bold tabular-nums text-primary w-12 text-right">{s.points}ms</span>
                <span className="text-xs tabular-nums text-gray-400 w-12 text-right">{s.secondaryPoints != null ? `${s.secondaryPoints}ms` : '—'}</span>
              </div>
            ))}
          </>
        )}
      </div>

      <div className="border-t border-gray-100 pt-3">
        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-2">All-Time Best</h2>
        <div className="flex flex-col gap-1 min-h-[60px]">
          {allTimeLoading ? (
            <p className="text-xs text-gray-400 italic">Loading...</p>
          ) : allTime.length === 0 ? (
            <p className="text-xs text-gray-400 italic">No all-time scores yet.</p>
          ) : (
            allTime.slice(0, 5).map((s, i) => (
              <div key={i} className="flex items-center gap-2 py-1 border-b border-gray-100 last:border-0">
                <span className="text-sm w-6 text-center">{MEDALS[i] ?? <span className="text-xs text-gray-400">{i + 1}</span>}</span>
                <span className="text-sm text-gray-800 font-medium flex-1 truncate">{s.name}</span>
                <span className="text-xs font-bold tabular-nums text-primary">{s.points}ms</span>
              </div>
            ))
          )}
        </div>
      </div>

      {gameEnded && (
        <div className="border-t border-gray-100 pt-4">
          {submitState === 'done' ? (
            <div className="text-center py-2">
              <p className="text-sm font-semibold text-green-600">Score saved!</p>
              <p className="text-xs text-gray-400 mt-1">Come back tomorrow to beat it.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
              <p className="text-xs font-semibold text-gray-700">
                {bestMs}ms best! Add your name to the board.
              </p>
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={30}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
              />
              <input
                type="email"
                placeholder="Email (optional)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
              />
              {email.trim() && (
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={marketingConsent}
                    onChange={(e) => setMarketingConsent(e.target.checked)}
                    className="mt-0.5 accent-primary"
                  />
                  <span className="text-xs text-gray-500">Send me DMV study tips and practice reminders</span>
                </label>
              )}
              <button
                type="submit"
                disabled={submitState === 'submitting'}
                className="w-full bg-primary hover:bg-primary-600 disabled:opacity-60 text-white font-bold py-2 rounded-lg text-sm transition-colors"
              >
                {submitState === 'submitting' ? 'Saving...' : 'Add to board'}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
