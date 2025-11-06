'use client';

import { useEffect, useState } from 'react';
import AppPromotion from './AppPromotion';

interface AppPromotionIOSProps {
  variant?: 'banner' | 'sidebar' | 'compact';
  className?: string;
}

/**
 * Client-side component that only shows app promotion to iOS users
 */
export default function AppPromotionIOS({ variant = 'sidebar', className = '' }: AppPromotionIOSProps) {
  const [isIOS, setIsIOS] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Detect iOS devices (iPhone, iPad, iPod)
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);

    setIsIOS(isIOSDevice);
    setIsLoading(false);
  }, []);

  // Don't render anything while loading to prevent flash
  if (isLoading) {
    return null;
  }

  // Only render for iOS users
  if (!isIOS) {
    return null;
  }

  return <AppPromotion variant={variant} className={className} />;
}
