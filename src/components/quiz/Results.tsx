'use client';

import { Quiz, QuizResult } from '@/types/quiz';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PartyPopper, FileText, Smartphone, Flame } from 'lucide-react';
import { useStreak } from '@/hooks/useStreak';

const APP_STORE_URL = 'https://apps.apple.com/app/dmv-california/id6754900213';

interface ResultsProps {
  result: QuizResult;
  quiz: Quiz;
  quizId: string | number;
  onRestart: () => void;
  /** A suggested next quiz to take (drives pageviews-per-session). */
  nextQuiz?: { slug: string; title: string };
  /** When true, show the streak banner below the score card. */
  showStreak?: boolean;
}

export default function Results({ result, quiz, quizId, onRestart, nextQuiz, showStreak }: ResultsProps) {
  const { passed, percentage, correctAnswers, totalQuestions } = result;
  const router = useRouter();
  const { streak } = useStreak();

  // Per-category performance → personalized "what to review" nudge that makes
  // a retake feel worthwhile (uses the category already on each question).
  const isSpanish = quiz.language === 'es';
  const categoryStats: Record<string, { correct: number; total: number }> = {};
  for (const q of quiz.questions) {
    const ans = result.answers.find((a) => a.questionId === q.id);
    const cat = q.category || (isSpanish ? 'General' : 'General');
    if (!categoryStats[cat]) categoryStats[cat] = { correct: 0, total: 0 };
    categoryStats[cat].total += 1;
    if (ans?.isCorrect) categoryStats[cat].correct += 1;
  }
  const weakCategories = Object.entries(categoryStats)
    .filter(([, s]) => s.correct < s.total)
    .map(([cat, s]) => ({ cat, ...s, pct: Math.round((s.correct / s.total) * 100) }))
    .sort((a, b) => a.pct - b.pct)
    .slice(0, 5);
  const reviewCopy = isSpanish
    ? { heading: 'Áreas para repasar', sub: 'Concéntrate en estos temas antes de volver a intentarlo:' }
    : { heading: 'Topics to review', sub: 'Focus on these topics before your retake:' };

  const [showLeaderboardModal, setShowLeaderboardModal] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmitToLeaderboard = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quizId: quizId,
          name: name.trim(),
          email: email.trim() || '',
          percentage: percentage,
          points: correctAnswers * 10, // 10 points per correct answer
          completedAt: result.completedAt,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit to leaderboard');
      }

      setSubmitted(true);

      // The quiz page is statically cached, so router.refresh() alone won't
      // re-pull the board. Tell the live Leaderboard widget to refetch now.
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('leaderboard:updated'));
      }
      router.refresh();

      setTimeout(() => {
        setShowLeaderboardModal(false);
      }, 2000);
    } catch (err) {
      setError('Failed to submit to leaderboard. Please try again.');
      console.error('Leaderboard submission error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Streak banner */}
      {showStreak && streak > 0 && (
        <div className={`mb-6 flex items-center gap-3 rounded-xl px-5 py-4 ${
          streak >= 7
            ? 'bg-orange-50 border border-orange-200'
            : 'bg-amber-50 border border-amber-200'
        }`}>
          <Flame className={`w-6 h-6 flex-shrink-0 ${streak >= 7 ? 'text-orange-500' : 'text-amber-500'}`} />
          <div>
            <p className={`font-bold text-sm ${streak >= 7 ? 'text-orange-700' : 'text-amber-700'}`}>
              {streak === 1
                ? 'Day 1 streak started!'
                : `${streak}-day streak!`}
            </p>
            <p className={`text-xs ${streak >= 7 ? 'text-orange-600' : 'text-amber-600'}`}>
              {streak >= 7
                ? 'Incredible consistency. Come back tomorrow to keep it going.'
                : 'Come back tomorrow to keep your streak alive.'}
            </p>
          </div>
        </div>
      )}

      {/* Leaderboard Submission Modal */}
      {showLeaderboardModal && !submitted && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
                {passed ? <><PartyPopper className="w-6 h-6 text-primary" /> Great Job!</> : <><FileText className="w-6 h-6 text-primary" /> Nice Try!</>}
              </h3>
              <p className="text-gray-600 mb-1">
                You scored <span className="font-bold text-primary">{percentage}%</span>
              </p>
              <p className="text-sm text-gray-500">
                Submit your score to the leaderboard!
              </p>
            </div>

            <form onSubmit={handleSubmitToLeaderboard} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  maxLength={50}
                  disabled={submitting}
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  maxLength={100}
                  disabled={submitting}
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowLeaderboardModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                  disabled={submitting}
                >
                  Skip
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    'Submit to Leaderboard'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Message */}
      {submitted && showLeaderboardModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 text-center animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
              <PartyPopper className="w-6 h-6 text-green-600" /> Submitted!
            </h3>
            <p className="text-gray-600">
              Your score has been added to the leaderboard!
            </p>
          </div>
        </div>
      )}

      {/* Result Header */}
      <div className={`rounded-lg shadow-lg p-8 mb-6 text-center ${
        passed ? 'bg-gradient-to-br from-green-500 to-green-600' : 'bg-gradient-to-br from-red-500 to-red-600'
      } text-white`}>
        <div className="mb-4 flex justify-center">
          {passed ? <PartyPopper className="w-16 h-16 text-white/90" /> : <FileText className="w-16 h-16 text-white/90" />}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          {passed ? 'Congratulations!' : 'Keep Practicing!'}
        </h1>
        <p className="text-xl text-white/90 mb-6">
          {passed
            ? `You passed the ${quiz.title}!`
            : `You need ${quiz.passingScore}% to pass. You can do it!`
          }
        </p>

        {/* Score Display */}
        <div className="bg-white/20 backdrop-blur rounded-lg p-6 mb-4">
          <div className="text-6xl font-bold mb-2">
            {percentage}%
          </div>
          <div className="text-lg text-white/90">
            {correctAnswers} out of {totalQuestions} correct
          </div>
        </div>

        <div className="flex flex-wrap gap-4 justify-center text-sm">
          <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-lg">
            <div className="font-semibold">Correct</div>
            <div className="text-2xl">{result.correctAnswers}</div>
          </div>
          <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-lg">
            <div className="font-semibold">Incorrect</div>
            <div className="text-2xl">{result.incorrectAnswers}</div>
          </div>
          <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-lg">
            <div className="font-semibold">Passing Score</div>
            <div className="text-2xl">{quiz.passingScore}%</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">What's Next?</h2>

        {/* Highest-intent moment: send them straight into another test */}
        {nextQuiz && (
          <Link
            href={`/practice-test/${nextQuiz.slug}`}
            className="mb-4 flex items-center justify-between gap-4 rounded-lg border-2 border-primary/30 bg-primary/5 px-5 py-4 hover:bg-primary/10 transition-colors group"
          >
            <span className="min-w-0">
              <span className="block text-xs font-semibold uppercase tracking-wide text-primary">
                Try another test
              </span>
              <span className="block font-bold text-gray-900 truncate">{nextQuiz.title}</span>
            </span>
            <span className="text-primary font-bold whitespace-nowrap group-hover:translate-x-0.5 transition-transform">
              Start →
            </span>
          </Link>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={onRestart}
            className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-600 transition-colors"
          >
            Retake Quiz
          </button>
          <Link
            href="/practice-test"
            className="px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors text-center"
          >
            All Practice Tests
          </Link>
        </div>
      </div>

      {/* Weak-topics review nudge (drives a focused retake) */}
      {weakCategories.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-1">{reviewCopy.heading}</h2>
          <p className="text-sm text-gray-600 mb-4">{reviewCopy.sub}</p>
          <ul className="space-y-3">
            {weakCategories.map(({ cat, correct, total, pct }) => (
              <li key={cat} className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-900">{cat}</span>
                    <span className="text-gray-500">{correct}/{total}</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${pct < 50 ? 'bg-red-500' : pct < 80 ? 'bg-yellow-500' : 'bg-green-500'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <button
            onClick={onRestart}
            className="mt-5 w-full sm:w-auto px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-600 transition-colors"
          >
            {isSpanish ? 'Repasar y volver a intentar' : 'Review & retake'}
          </button>
        </div>
      )}

      {/* App Promotion */}
      <div className="bg-gradient-to-r from-primary to-primary-600 rounded-lg shadow-lg p-6 mb-6 text-white">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-shrink-0">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center">
              <Smartphone className="w-10 h-10 text-white" />
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl font-bold mb-2">Practice Anytime, Anywhere!</h3>
            <p className="text-white/90 mb-4">
              Download our free iOS app for offline practice, flashcards, and progress tracking.
              Perfect for studying on the go!
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Offline Access
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                1,164+ Questions • 11 Languages
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Flashcards
              </span>
            </div>
          </div>
          <div className="flex-shrink-0 flex items-center gap-4">
            {/* QR Code - visible on desktop */}
            <div className="hidden md:block text-center">
              <Image
                src="/images/dmv-qrcode.png"
                alt="Scan to download DMV California app"
                width={80}
                height={80}
                className="rounded-lg border-2 border-white/30"
              />
              <p className="text-xs text-white/70 mt-1">Scan to download</p>
            </div>
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:opacity-80 transition-opacity"
            >
              <Image
                src="/images/app-store-badge.svg"
                alt="Download on the App Store"
                width={160}
                height={48}
                className="drop-shadow-lg"
              />
            </a>
          </div>
        </div>
      </div>

      {/* Answer Review */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Review Your Answers</h2>
        <div className="space-y-6">
          {quiz.questions.map((question, index) => {
            const answer = result.answers.find(a => a.questionId === question.id);
            const isCorrect = answer?.isCorrect ?? false;
            const selectedAnswer = answer?.selectedAnswer ?? -1;

            return (
              <div key={question.id} className={`border-l-4 pl-4 ${
                isCorrect ? 'border-green-500' : 'border-red-500'
              }`}>
                <div className="flex items-start gap-3 mb-3">
                  <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                    isCorrect ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {question.question}
                    </h3>

                    {/* Show selected answer if wrong */}
                    {!isCorrect && selectedAnswer !== -1 && (
                      <div className="mb-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="text-sm font-medium text-red-900 mb-1">Your Answer:</div>
                        <div className="text-red-700">{question.options[selectedAnswer]}</div>
                      </div>
                    )}

                    {/* Show correct answer */}
                    <div className="mb-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="text-sm font-medium text-green-900 mb-1">Correct Answer:</div>
                      <div className="text-green-700">{question.options[question.correctAnswer]}</div>
                    </div>

                    {/* Show explanation */}
                    {question.explanation && (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="text-sm font-medium text-blue-900 mb-1">Explanation:</div>
                        <div className="text-blue-700 text-sm">{question.explanation}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="mt-6 text-center">
        <Link
          href="/practice-test"
          className="text-primary hover:text-primary-600 font-medium"
        >
          ← Back to Practice Tests
        </Link>
      </div>
    </div>
  );
}
