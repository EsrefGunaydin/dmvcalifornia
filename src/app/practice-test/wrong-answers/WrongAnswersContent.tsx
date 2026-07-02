'use client';

import { useEffect, useState } from 'react';
import QuizEngine from '@/components/quiz/QuizEngine';
import Link from 'next/link';
import { CheckCircle, RotateCcw, ChevronRight } from 'lucide-react';
import type { Quiz, Question, QuizResult } from '@/types/quiz';

interface WrongAnswersContentProps {
  allQuizzes: Quiz[];
}

export default function WrongAnswersContent({ allQuizzes }: WrongAnswersContentProps) {
  const [loaded, setLoaded] = useState(false);
  const [wrongQuiz, setWrongQuiz] = useState<Quiz | null>(null);
  const [totalScanned, setTotalScanned] = useState(0);

  useEffect(() => {
    const quizById = new Map(allQuizzes.map(q => [q.id, q]));

    const raw = localStorage.getItem('quiz-results');
    if (!raw) { setLoaded(true); return; }

    let results: QuizResult[] = [];
    try { results = JSON.parse(raw); } catch { setLoaded(true); return; }

    setTotalScanned(results.length);

    // Collect unique wrong {quizId:questionId} pairs
    const seen = new Set<string>();
    const wrong: { quizId: string; questionId: number }[] = [];
    for (const result of results) {
      for (const ans of result.answers) {
        if (!ans.isCorrect) {
          const key = `${result.quizId}:${ans.questionId}`;
          if (!seen.has(key)) {
            seen.add(key);
            wrong.push({ quizId: result.quizId, questionId: ans.questionId });
          }
        }
      }
    }

    if (wrong.length === 0) { setLoaded(true); return; }

    // Look up each question and reassign sequential IDs to avoid cross-quiz collisions
    const foundQuestions: Question[] = [];
    let nextId = 1;
    for (const { quizId, questionId } of wrong) {
      const quiz = quizById.get(quizId);
      if (!quiz) continue;
      const q = quiz.questions.find(q => q.id === questionId);
      if (!q) continue;
      foundQuestions.push({ ...q, id: nextId++ });
    }

    if (foundQuestions.length === 0) { setLoaded(true); return; }

    const synthetic: Quiz = {
      id: 'wrong-answers',
      title: 'Review your wrong answers',
      description: `${foundQuestions.length} questions you got wrong in previous tests.`,
      category: 'Review',
      slug: 'wrong-answers',
      questions: foundQuestions,
      passingScore: 83,
    };

    setWrongQuiz(synthetic);
    setLoaded(true);
  }, [allQuizzes]);

  if (!loaded) {
    return (
      <div className="text-center py-20 text-gray-500">Loading your results...</div>
    );
  }

  if (!wrongQuiz) {
    return (
      <div className="max-w-xl mx-auto text-center py-20 px-4">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          {totalScanned > 0 ? 'No wrong answers on record.' : 'No quiz history yet.'}
        </h2>
        <p className="text-gray-600 mb-8">
          {totalScanned > 0
            ? 'You got every question right in your recorded tests. Take a harder test to find your weak spots.'
            : 'Complete at least one practice test and come back here to review the questions you missed.'}
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/practice-test/california-dmv-practice-test-2026"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Start a practice test
            <ChevronRight className="w-4 h-4" />
          </Link>
          <Link
            href="/california-dmv-marathon-test"
            className="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Try the marathon
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Context bar */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 mb-8 flex items-start gap-3">
        <RotateCcw className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-amber-800">
          <span className="font-semibold">{wrongQuiz.questions.length} questions</span> pulled from{' '}
          {totalScanned} past {totalScanned === 1 ? 'quiz' : 'quizzes'} — these are the ones you got wrong.
          Answer them all correctly to build confidence before your next full test.
        </div>
      </div>

      <QuizEngine
        quiz={wrongQuiz}
        quizId="wrong-answers"
        nextQuiz={{ slug: 'california-dmv-practice-test-2026', title: 'Full practice test' }}
      />
    </div>
  );
}
