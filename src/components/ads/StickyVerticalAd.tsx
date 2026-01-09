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
}

export default function StickyVerticalAd({ position, currentIndex }: StickyVerticalAdProps) {
  // Use key to force remount of ad element on navigation
  const [adKey, setAdKey] = useState(0);
  const adContainerRef = useRef<HTMLDivElement>(null);
  const previousIndex = useRef<number | undefined>(currentIndex);

  // Detect navigation and refresh ad
  useEffect(() => {
    // Skip on initial mount, only refresh on navigation
    if (previousIndex.current !== undefined &&
        previousIndex.current !== currentIndex) {
      // Increment key to force remount of ad element
      setAdKey(prev => prev + 1);
    }
    previousIndex.current = currentIndex;
  }, [currentIndex]);

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
