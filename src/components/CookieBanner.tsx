'use client';

import { useState, useEffect } from 'react';

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const cookiesAccepted = localStorage.getItem('cookiesAccepted');
    if (!cookiesAccepted) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookiesAccepted', 'true');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 shadow-2xl z-50 animate-in slide-in-from-bottom duration-300">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm md:text-base">
              We use cookies to enhance your browsing experience and analyze our traffic.
              By clicking "Accept", you consent to our use of cookies.
              <a
                href="/privacy-policy"
                className="underline hover:text-primary-300 ml-1"
              >
                Privacy Policy
              </a>
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleAccept}
              className="bg-primary hover:bg-primary-600 text-white px-6 py-2 rounded-lg font-medium transition-colors whitespace-nowrap"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
