'use client';

import { useEffect, useRef } from 'react';

interface AdRefreshManagerProps {
  currentQuestionIndex: number;
  quizCompleted: boolean;
  totalQuestions: number;
  refreshInterval?: number; // Refresh every N questions (default: 5)
  minTimeBetweenRefresh?: number; // Min seconds between refreshes (default: 30)
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

/**
 * Smart Ad Refresh Manager for Quiz Pages
 *
 * Refreshes AdSense ads based on user engagement:
 * - Every 5-10 questions (configurable)
 * - When quiz is completed
 * - Respects minimum time between refreshes (30 seconds)
 *
 * Compliant with AdSense policies:
 * - Only refreshes on genuine user interaction
 * - Tracks engagement time
 * - Prevents rapid-fire refreshes
 */
export default function AdRefreshManager({
  currentQuestionIndex,
  quizCompleted,
  totalQuestions,
  refreshInterval = 5,
  minTimeBetweenRefresh = 30,
}: AdRefreshManagerProps) {
  const lastRefreshTime = useRef<number>(Date.now());
  const lastRefreshQuestion = useRef<number>(0);
  const hasRefreshedForCompletion = useRef<boolean>(false);

  useEffect(() => {
    // Don't refresh ads if AdSense is not loaded
    if (typeof window === 'undefined' || !window.adsbygoogle) {
      return;
    }

    const now = Date.now();
    const timeSinceLastRefresh = (now - lastRefreshTime.current) / 1000; // seconds
    const questionsSinceLastRefresh = currentQuestionIndex - lastRefreshQuestion.current;

    // Determine if we should refresh ads
    let shouldRefresh = false;
    let refreshReason = '';

    // Case 1: Quiz completed (and we haven't refreshed for completion yet)
    if (quizCompleted && !hasRefreshedForCompletion.current) {
      shouldRefresh = true;
      refreshReason = 'quiz_completed';
      hasRefreshedForCompletion.current = true;
    }
    // Case 2: User has progressed through enough questions
    else if (
      !quizCompleted &&
      questionsSinceLastRefresh >= refreshInterval &&
      timeSinceLastRefresh >= minTimeBetweenRefresh
    ) {
      shouldRefresh = true;
      refreshReason = `${questionsSinceLastRefresh}_questions`;
    }

    // Perform ad refresh if conditions are met
    if (shouldRefresh) {
      console.log(`[AdRefresh] Refreshing ads: ${refreshReason} (Question ${currentQuestionIndex + 1}/${totalQuestions})`);

      try {
        // Method 1: Push empty object to trigger ad refresh
        // This tells AdSense "new content, please refresh ads"
        (window.adsbygoogle = window.adsbygoogle || []).push({});

        // Update tracking refs
        lastRefreshTime.current = now;
        lastRefreshQuestion.current = currentQuestionIndex;

        // Optional: Track ad refreshes for analytics
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'ad_refresh', {
            event_category: 'ads',
            event_label: refreshReason,
            question_number: currentQuestionIndex + 1,
          });
        }
      } catch (error) {
        console.error('[AdRefresh] Error refreshing ads:', error);
      }
    }
  }, [currentQuestionIndex, quizCompleted, totalQuestions, refreshInterval, minTimeBetweenRefresh]);

  // Reset completion flag when quiz restarts
  useEffect(() => {
    if (currentQuestionIndex === 0 && !quizCompleted) {
      hasRefreshedForCompletion.current = false;
    }
  }, [currentQuestionIndex, quizCompleted]);

  // This component doesn't render anything
  return null;
}
