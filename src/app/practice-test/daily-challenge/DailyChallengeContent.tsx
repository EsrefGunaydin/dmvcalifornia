'use client';

import { useEffect, useState } from 'react';
import QuizEngine from '@/components/quiz/QuizEngine';
import Link from 'next/link';
import { CheckCircle, Calendar } from 'lucide-react';
import type { Quiz, Question, QuizResult } from '@/types/quiz';
import { dailyQuizId } from '@/lib/dailyChallenge';

interface DailyChallengeContentProps {
  questions: Question[];
  date: string;
}

export default function DailyChallengeContent({ questions, date }: DailyChallengeContentProps) {
  const [alreadyDone, setAlreadyDone] = useState<boolean | null>(null);
  const [pastScore, setPastScore] = useState<number | null>(null);
  const qid = dailyQuizId(date);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('quiz-results');
      if (!raw) { setAlreadyDone(false); return; }
      const results: QuizResult[] = JSON.parse(raw);
      const done = results.findLast((r) => r.quizId === qid);
      if (done) { setAlreadyDone(true); setPastScore(done.percentage); }
      else setAlreadyDone(false);
    } catch {
      setAlreadyDone(false);
    }
  }, [qid]);

  if (alreadyDone === null) return null;

  if (alreadyDone) {
    return (
      <div className="max-w-xl mx-auto text-center py-16 px-4">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Already done today!</h2>
        <p className="text-gray-600 mb-2">You scored {pastScore}% on today&apos;s challenge.</p>
        <p className="text-gray-500 text-sm mb-8">Come back tomorrow for a fresh set of 10 questions. Meanwhile, keep the momentum going:</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/practice-test/california-dmv-practice-test-2026"
            className="inline-flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Full practice test
          </Link>
          <Link
            href="/practice-test/wrong-answers"
            className="inline-flex items-center justify-center gap-2 border-2 border-amber-300 bg-amber-50 text-amber-800 px-6 py-3 rounded-lg font-medium hover:bg-amber-100 transition-colors"
          >
            Retry your wrong answers
          </Link>
          <Link
            href="/practice-test"
            className="inline-flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            <Calendar className="w-4 h-4" />
            All practice tests
          </Link>
        </div>
      </div>
    );
  }

  const dailyQuiz: Quiz = {
    id: qid,
    title: `Daily Challenge — ${date}`,
    description: '10 questions, same for everyone today. Updates at midnight UTC.',
    category: 'Daily Challenge',
    slug: 'daily-challenge',
    questions,
    passingScore: 80,
  };

  return (
    <QuizEngine
      quiz={dailyQuiz}
      quizId={qid}
      nextQuiz={{ slug: 'california-dmv-practice-test-2026', title: 'Full practice test' }}
    />
  );
}
