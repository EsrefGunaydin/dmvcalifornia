'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function QuizPromotionPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [hasTimePassed, setHasTimePassed] = useState(false);
  // Once dismissed in-session, never auto-reopen. Without this the "open
  // popup" effect would re-fire as soon as isVisible flipped to false and the
  // popup would blink back instantly.
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if user has dismissed popup in last 7 days
    const dismissedUntil = localStorage.getItem('quizPopupDismissedUntil');
    if (dismissedUntil && new Date().getTime() < parseInt(dismissedUntil)) {
      return; // Don't show popup
    }

    // Check if user already visited quiz pages in this session
    const visitedQuiz = sessionStorage.getItem('visitedQuizPage');
    if (visitedQuiz) {
      return; // Don't show popup
    }

    // Set 30-second timer
    const timer = setTimeout(() => {
      setHasTimePassed(true);
    }, 30000); // 30 seconds

    // Scroll detection (25% of page)
    const handleScroll = () => {
      const scrollPercentage =
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercentage >= 25) {
        setHasScrolled(true);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Show popup when both conditions are met (and the user hasn't dismissed it
  // in this session).
  useEffect(() => {
    if (hasTimePassed && hasScrolled && !dismissed) {
      setIsVisible(true);
    }
  }, [hasTimePassed, hasScrolled, dismissed]);

  // Advertise visibility so other floating UI (e.g. UpNextBar) can yield to
  // this popup instead of stacking on top of it.
  useEffect(() => {
    if (isVisible) {
      document.documentElement.dataset.quizPopupOpen = '1';
    } else {
      delete document.documentElement.dataset.quizPopupOpen;
    }
    return () => {
      delete document.documentElement.dataset.quizPopupOpen;
    };
  }, [isVisible]);

  const handleDismiss = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    setDismissed(true);
    setIsVisible(false);
    // Don't show again for 7 days
    const dismissUntil = new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
    localStorage.setItem('quizPopupDismissedUntil', dismissUntil.toString());
  };

  const handleClickCTA = () => {
    setDismissed(true);
    setIsVisible(false);
    sessionStorage.setItem('visitedQuizPage', 'true');
  };

  if (!isVisible) return null;

  // Wrapper is pointer-events-none so the 16px margin region around the card
  // doesn't swallow clicks meant for the page behind it. The card itself opts
  // back in with pointer-events-auto so its own buttons remain clickable.
  return (
    <div className="fixed bottom-4 right-4 z-[100000] w-full max-w-sm animate-in slide-in-from-bottom-4 duration-500 pointer-events-none">
      <div className="bg-white rounded-lg shadow-2xl border-2 border-primary p-6 m-4 relative pointer-events-auto">
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 p-2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          aria-label="Close popup"
          type="button"
        >
          <svg
            className="w-5 h-5 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Icon */}
        <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
          <svg
            className="w-6 h-6 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
            />
          </svg>
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to Pass Your DMV Test?</h3>
        <p className="text-gray-600 mb-4">
          Practice with 1,164+ Real DMV Questions in 11 Languages
        </p>

        {/* Benefits */}
        <ul className="space-y-2 mb-6">
          <li className="flex items-start gap-2 text-sm text-gray-700">
            <svg
              className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>Full simulation tests</span>
          </li>
          <li className="flex items-start gap-2 text-sm text-gray-700">
            <svg
              className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>Instant feedback & explanations</span>
          </li>
          <li className="flex items-start gap-2 text-sm text-gray-700">
            <svg
              className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>Track your progress</span>
          </li>
        </ul>

        {/* CTA Buttons */}
        <div className="flex gap-3">
          <Link
            href="/practice-test"
            onClick={handleClickCTA}
            className="flex-1 bg-primary hover:bg-primary-600 text-white font-bold py-3 px-4 rounded-lg text-center transition-colors"
          >
            Start Practice Test
          </Link>
          <button
            onClick={handleDismiss}
            className="px-4 py-3 text-gray-600 hover:text-gray-800 font-medium text-sm transition-colors cursor-pointer"
            type="button"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
}
