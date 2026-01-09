'use client';

import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface QuizAdProps {
  currentQuestionIndex?: number;
}

export default function QuizAd({ currentQuestionIndex }: QuizAdProps) {
  // Use key to force remount of ad element on question change
  const [adKey, setAdKey] = useState(0);
  const adContainerRef = useRef<HTMLDivElement>(null);
  const previousQuestionIndex = useRef<number | undefined>(currentQuestionIndex);

  // Detect question navigation and refresh ad
  useEffect(() => {
    // Skip on initial mount, only refresh on navigation
    if (previousQuestionIndex.current !== undefined &&
        previousQuestionIndex.current !== currentQuestionIndex) {
      // Increment key to force remount of ad element
      setAdKey(prev => prev + 1);
    }
    previousQuestionIndex.current = currentQuestionIndex;
  }, [currentQuestionIndex]);

  // Initialize ad when component mounts or remounts (key changes)
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && adContainerRef.current) {
        const insElement = adContainerRef.current.querySelector('.adsbygoogle');
        // Check if ad needs initialization
        if (insElement && !insElement.getAttribute('data-ad-status')) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, [adKey]);

  return (
    <div className="my-6" ref={adContainerRef}>
      <ins
        key={adKey}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-format="fluid"
        data-ad-layout-key="-fb+5w+4e-db+86"
        data-ad-client="ca-pub-7030490358552434"
        data-ad-slot="2206401097"
      />
    </div>
  );
}
