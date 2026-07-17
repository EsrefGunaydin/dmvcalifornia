'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Shuffle } from 'lucide-react';
import QuizEngine from '@/components/quiz/QuizEngine';
import { drawSimulatorQuiz } from '@/lib/quizPool';
import type { Quiz, QuizLanguage } from '@/types/quiz';

interface SimulatorContentProps {
  lang: QuizLanguage;
  nextQuiz?: { slug: string; title: string };
}

export default function SimulatorContent({ lang, nextQuiz }: SimulatorContentProps) {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [poolSize, setPoolSize] = useState(0);
  const [truncated, setTruncated] = useState(false);

  // Draw a fresh random set on mount. If the user has an incomplete attempt
  // saved under this language's stable quizId, QuizEngine restores that
  // shuffle instead of this draw — same resume behavior as every other quiz.
  useEffect(() => {
    const draw = drawSimulatorQuiz(lang);
    setQuiz(draw.quiz);
    setPoolSize(draw.poolSize);
    setTruncated(draw.truncated);
  }, [lang]);

  if (!quiz) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
          <p className="text-gray-600 mt-4">Building your test...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-blue-50 border border-blue-200 rounded-xl px-5 py-4 mb-6 flex items-start gap-3">
        <Shuffle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          {truncated ? (
            <>
              <span className="font-semibold">Every question in the pool ({poolSize}) is included</span>, in a
              new random order. This language doesn't have enough questions yet for a full random 46-question
              draw, come back as the question bank grows.
            </>
          ) : (
            <>
              <span className="font-semibold">{quiz.questions.length} questions</span>, drawn at random from a
              pool of {poolSize}. Take it again for a different set every time.{' '}
              <Link href="/practice-test/wrong-answers" className="underline font-medium">
                Missed questions get saved for review.
              </Link>
            </>
          )}
        </div>
      </div>

      <QuizEngine quiz={quiz} quizId={quiz.id} nextQuiz={nextQuiz} />
    </div>
  );
}
