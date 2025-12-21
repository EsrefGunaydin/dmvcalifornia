'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface QuizAdProps {
  currentQuestionIndex?: number;
}

export default function QuizAd({ currentQuestionIndex }: QuizAdProps) {
  const adContainerRef = useRef<HTMLDivElement>(null);
  const adInitialized = useRef(false);

  useEffect(() => {
    // Only initialize ad once
    if (adInitialized.current) return;

    try {
      if (typeof window !== 'undefined' && adContainerRef.current) {
        const insElement = adContainerRef.current.querySelector('.adsbygoogle');
        // Check if ad is already loaded
        if (insElement && !insElement.getAttribute('data-ad-status')) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          adInitialized.current = true;
        }
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  return (
    <div className="my-6" ref={adContainerRef}>
      <ins
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
