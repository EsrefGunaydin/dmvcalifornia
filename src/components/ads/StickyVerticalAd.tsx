'use client';

import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface StickyVerticalAdProps {
  position: 'left' | 'right';
  currentIndex?: number;
  // Questions between refreshes (default 5). Time gate (30s) always applies.
  refreshEvery?: number;
}

const MIN_SECONDS = 30;

export default function StickyVerticalAd({ position, currentIndex, refreshEvery = 5 }: StickyVerticalAdProps) {
  const [adKey, setAdKey] = useState(0);
  const adContainerRef = useRef<HTMLDivElement>(null);
  const lastRefreshIndex = useRef<number>(currentIndex ?? 0);
  const lastRefreshTime = useRef<number>(Date.now());

  useEffect(() => {
    if (currentIndex === undefined) return;

    const questionsDelta = currentIndex - lastRefreshIndex.current;
    const secondsDelta = (Date.now() - lastRefreshTime.current) / 1000;

    if (questionsDelta >= refreshEvery && secondsDelta >= MIN_SECONDS) {
      setAdKey(prev => prev + 1);
      lastRefreshIndex.current = currentIndex;
      lastRefreshTime.current = Date.now();
    }
  }, [currentIndex, refreshEvery]);

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

  const positionClasses = position === 'left'
    ? 'left-0 xl:left-2 2xl:left-4'
    : 'right-0 xl:right-2 2xl:right-4';

  return (
    <div
      className={`hidden xl:block fixed top-1/2 -translate-y-1/2 ${positionClasses} z-40`}
      ref={adContainerRef}
    >
      <ins
        key={adKey}
        className="adsbygoogle"
        style={{ display: 'block', width: '160px', height: '600px' }}
        data-ad-client="ca-pub-7030490358552434"
        data-ad-slot="6046896654"
        data-ad-format="vertical"
      />
    </div>
  );
}
