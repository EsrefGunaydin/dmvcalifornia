'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';

const APP_STORE_URL = 'https://apps.apple.com/app/dmv-california/id6754900213';
const STORAGE_KEY = 'exitIntentDismissed';
const COOLDOWN_DAYS = 7;

export default function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    // Store dismissal with timestamp
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
  }, []);

  useEffect(() => {
    // Check if popup was recently dismissed
    const dismissedTime = localStorage.getItem(STORAGE_KEY);
    if (dismissedTime) {
      const daysSinceDismissed = (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < COOLDOWN_DAYS) {
        return; // Don't show popup during cooldown period
      }
    }

    // Exit intent detection for desktop
    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger when mouse leaves through the top of the viewport
      if (e.clientY <= 0 && !hasTriggered) {
        setHasTriggered(true);
        setIsVisible(true);
      }
    };

    // For mobile, we can detect back button or page visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && !hasTriggered) {
        // User is leaving - we can't show popup when hidden, but we track intent
        setHasTriggered(true);
      }
    };

    // Add event listeners
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [hasTriggered]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVisible) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isVisible, handleClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 fade-in duration-300">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          aria-label="Close popup"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-primary to-primary-600 text-white p-6 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">📱</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">Wait! Before You Go...</h2>
          <p className="text-white/90">
            Take your DMV practice anywhere with our free iOS app!
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Features */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-gray-700">500+ Practice Questions</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-gray-700">Works Offline - No Internet Needed</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-gray-700">Interactive Flashcards</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-gray-700">Track Your Progress</span>
            </div>
          </div>

          {/* CTA with QR Code */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            {/* QR Code - visible on desktop */}
            <div className="hidden sm:block text-center">
              <Image
                src="/images/dmv-qrcode.png"
                alt="Scan to download DMV California app"
                width={100}
                height={100}
                className="rounded-lg border-2 border-gray-200"
              />
              <p className="text-xs text-gray-500 mt-1">Scan with phone</p>
            </div>

            {/* App Store Badge */}
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
              onClick={handleClose}
            >
              <Image
                src="/images/app-store-badge.svg"
                alt="Download on the App Store"
                width={180}
                height={54}
                className="hover:opacity-80 transition-opacity"
              />
            </a>
          </div>

          {/* Skip link */}
          <button
            onClick={handleClose}
            className="w-full mt-4 text-gray-500 hover:text-gray-700 text-sm transition-colors"
          >
            No thanks, I'll continue on the website
          </button>
        </div>
      </div>
    </div>
  );
}
