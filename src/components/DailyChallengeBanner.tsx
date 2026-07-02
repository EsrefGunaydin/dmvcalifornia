'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, CheckCircle, ChevronRight } from 'lucide-react';
import { dailyQuizId, todayUTC } from '@/lib/dailyChallenge';
import type { QuizResult } from '@/types/quiz';

export default function DailyChallengeBanner() {
  const [doneToday, setDoneToday] = useState<boolean | null>(null);
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    const qid = dailyQuizId(todayUTC());
    try {
      const raw = localStorage.getItem('quiz-results');
      if (!raw) { setDoneToday(false); return; }
      const results: QuizResult[] = JSON.parse(raw);
      const todayResult = results.findLast((r) => r.quizId === qid);
      if (todayResult) {
        setDoneToday(true);
        setScore(todayResult.percentage);
      } else {
        setDoneToday(false);
      }
    } catch {
      setDoneToday(false);
    }
  }, []);

  if (doneToday === null) return null; // avoid layout shift

  if (doneToday) {
    return (
      <div className="rounded-2xl border-2 border-green-200 bg-green-50 p-5 flex items-center gap-4">
        <CheckCircle className="w-8 h-8 text-green-500 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 text-sm">Daily challenge complete</p>
          <p className="text-xs text-gray-500 mt-0.5">
            You scored {score}% today. Come back tomorrow for a fresh set.
          </p>
        </div>
        <Link
          href="/practice-test/daily-challenge"
          className="text-xs text-green-700 font-medium whitespace-nowrap hover:underline"
        >
          View results
        </Link>
      </div>
    );
  }

  return (
    <Link
      href="/practice-test/daily-challenge"
      className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-5 flex items-center gap-4 hover:bg-primary/10 transition-colors group"
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
        <Calendar className="w-5 h-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-gray-900 text-sm">Daily challenge</p>
        <p className="text-xs text-gray-500 mt-0.5">10 questions, updates at midnight. Same for everyone.</p>
      </div>
      <span className="text-primary font-bold text-sm whitespace-nowrap group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
        Start <ChevronRight className="w-4 h-4" />
      </span>
    </Link>
  );
}
