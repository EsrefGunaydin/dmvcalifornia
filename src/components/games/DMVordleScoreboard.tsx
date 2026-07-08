'use client';

import { useState, useEffect, useRef } from 'react';

interface ScoreEntry {
  name: string;
  points: number; // attempt count: 1-6, or 7 = failed
}

interface Props {
  quizId: string;       // e.g. 'dmvordle-2026-07-08'
  dayIndex: number;
  gameState: 'playing' | 'won' | 'lost';
  attempts: number;     // 1-6 guesses used, or 7 if lost
}

const MEDALS = ['🥇', '🥈', '🥉'];

function attemptsLabel(points: number) {
  return points <= 6 ? `${points}/6` : 'X/6';
}

function percentageFromAttempts(attempts: number): number {
  if (attempts > 6) return 0;
  return Math.round(((7 - attempts) / 6) * 100 * 10) / 10;
}

export default function DMVordleScoreboard({ quizId, dayIndex, gameState, attempts }: Props) {
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [marketingConsent, setMarketingConsent] = useState(true);
  const [submitState, setSubmitState] = useState<'idle' | 'submitting' | 'done'>('idle');
  const idempotencyKeyRef = useRef<string | null>(null);

  const gameEnded = gameState !== 'playing';

  // Get or create idempotency key for this day (prevents double-submit on refresh)
  useEffect(() => {
    const stored = localStorage.getItem(`dmvordle-ikey-${quizId}`);
    if (stored) {
      idempotencyKeyRef.current = stored;
    } else {
      const k = crypto.randomUUID();
      localStorage.setItem(`dmvordle-ikey-${quizId}`, k);
      idempotencyKeyRef.current = k;
    }
    // Check if already submitted today
    if (localStorage.getItem(`dmvordle-submitted-${quizId}`)) {
      setSubmitState('done');
    }
  }, [quizId]);

  const fetchScores = async () => {
    try {
      const res = await fetch(`/api/leaderboard?quizId=${encodeURIComponent(quizId)}`);
      if (!res.ok) return;
      const data = await res.json();
      const entries: ScoreEntry[] = (data.entries ?? []).map((e: { name: string; points: number }) => ({
        name: e.name,
        points: e.points,
      }));
      setScores(entries);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    fetchScores();
    const interval = setInterval(fetchScores, 30000);
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
          percentage: percentageFromAttempts(attempts),
          points: attempts,
          completedAt: new Date().toISOString(),
          idempotencyKey: idempotencyKeyRef.current,
        }),
      });
      localStorage.setItem(`dmvordle-submitted-${quizId}`, '1');
      setSubmitState('done');
      fetchScores();
    } catch {
      setSubmitState('idle');
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Today&apos;s Board</h2>
        <span className="text-xs text-gray-400">#{dayIndex}</span>
      </div>

      {/* Scores */}
      <div className="flex flex-col gap-1 min-h-[120px]">
        {loading ? (
          <p className="text-xs text-gray-400 italic">Loading...</p>
        ) : scores.length === 0 ? (
          <p className="text-xs text-gray-400 italic">No scores yet today. Be the first!</p>
        ) : (
          scores.slice(0, 20).map((s, i) => (
            <div key={i} className="flex items-center gap-2 py-1.5 border-b border-gray-100 last:border-0">
              <span className="text-sm w-6 text-center">{MEDALS[i] ?? <span className="text-xs text-gray-400">{i + 1}</span>}</span>
              <span className="text-sm text-gray-800 font-medium flex-1 truncate">{s.name}</span>
              <span className={`text-xs font-bold tabular-nums ${s.points <= 3 ? 'text-green-600' : s.points <= 6 ? 'text-yellow-600' : 'text-red-500'}`}>
                {attemptsLabel(s.points)}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Submission form — only after game ends */}
      {gameEnded && (
        <div className="border-t border-gray-100 pt-4">
          {submitState === 'done' ? (
            <div className="text-center py-2">
              <p className="text-sm font-semibold text-green-600">Score saved!</p>
              <p className="text-xs text-gray-400 mt-1">Come back tomorrow for a new word.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
              <p className="text-xs font-semibold text-gray-700">
                {gameState === 'won'
                  ? `You got it in ${attempts}! Add your name to the board.`
                  : 'Add your name to the board.'}
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
