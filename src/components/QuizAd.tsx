'use client';

import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface QuizAdProps {
  currentQuestionIndex?: number; // Pass this to trigger refresh
}

export default function QuizAd({ currentQuestionIndex }: QuizAdProps) {
  const adContainerRef = useRef<HTMLDivElement>(null);
  const [adKey, setAdKey] = useState(0);

  useEffect(() => {
    // Refresh ad when question changes
    if (currentQuestionIndex !== undefined) {
      // Force re-render by updating key
      setAdKey(prev => prev + 1);
    }
  }, [currentQuestionIndex]);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && adContainerRef.current) {
        // Push to adsbygoogle to initialize the ad
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, [adKey]); // Re-run when adKey changes

  return (
    <div className="my-6" ref={adContainerRef} key={adKey}>
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
