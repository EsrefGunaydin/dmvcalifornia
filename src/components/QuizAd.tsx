'use client';

import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface QuizAdProps {
  currentQuestionIndex?: number;
  // Questions between refreshes (default 5). Time gate (30s) always applies.
  refreshEvery?: number;
}

const MIN_SECONDS = 30;

export default function QuizAd({ currentQuestionIndex, refreshEvery = 5 }: QuizAdProps) {
  const [adKey, setAdKey] = useState(0);
  const adContainerRef = useRef<HTMLDivElement>(null);
  const lastRefreshQuestion = useRef<number>(currentQuestionIndex ?? 0);
  const lastRefreshTime = useRef<number>(Date.now());

  useEffect(() => {
    if (currentQuestionIndex === undefined) return;

    const questionsDelta = currentQuestionIndex - lastRefreshQuestion.current;
    const secondsDelta = (Date.now() - lastRefreshTime.current) / 1000;

    if (questionsDelta >= refreshEvery && secondsDelta >= MIN_SECONDS) {
      setAdKey(prev => prev + 1);
      lastRefreshQuestion.current = currentQuestionIndex;
      lastRefreshTime.current = Date.now();
    }
  }, [currentQuestionIndex, refreshEvery]);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && adContainerRef.current) {
        const ins = adContainerRef.current.querySelector('.adsbygoogle');
        if (ins && !ins.getAttribute('data-ad-status')) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      }
    } catch (e) {
      console.error('AdSense error:', e);
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
