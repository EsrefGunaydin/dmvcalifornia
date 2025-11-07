'use client';

import { useEffect, useState, useRef } from 'react';

interface BlogViewTrackerProps {
  slug: string;
  initialViews: number;
}

export default function BlogViewTracker({ slug, initialViews }: BlogViewTrackerProps) {
  const [views, setViews] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const hasTracked = useRef(false);

  useEffect(() => {
    // Mark component as mounted to prevent hydration mismatch
    setIsMounted(true);

    // Prevent double tracking using ref (handles React StrictMode)
    if (hasTracked.current) {
      return;
    }

    // Check sessionStorage to prevent double counting in same session
    const sessionKey = `blog_view_tracked_${slug}`;
    const alreadyTrackedInSession = sessionStorage.getItem(sessionKey);

    if (alreadyTrackedInSession) {
      // Already tracked in this session, just fetch the count
      const trackView = async () => {
        try {
          const response = await fetch(`/api/blog-views?slug=${encodeURIComponent(slug)}`);
          if (response.ok) {
            const data = await response.json();
            setViews(data.views);
          }
        } catch (error) {
          console.error('Failed to fetch blog views:', error);
          setViews(initialViews);
        }
      };
      trackView();
      return;
    }

    // Mark as tracked
    hasTracked.current = true;

    const trackView = async () => {
      try {
        // Increment view count in MongoDB
        const response = await fetch('/api/blog-views', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ slug }),
        });

        if (response.ok) {
          const data = await response.json();
          // Update with the new incremented count from MongoDB
          setViews(data.views);
          // Mark as tracked in session storage
          sessionStorage.setItem(sessionKey, 'true');
        }
      } catch (error) {
        console.error('Failed to track blog view:', error);
        // On error, show the initial views from JSON
        setViews(initialViews);
      }
    };

    trackView();
  }, [slug, initialViews]);

  // Don't render on server to prevent hydration errors
  if (!isMounted) {
    return null;
  }

  return (
    <div className="mt-8 pt-6 border-t border-gray-200 flex items-center gap-2 text-sm text-gray-500">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.723 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
      <span>
        Post Views: {views !== null ? views.toLocaleString() : '...'}
      </span>
    </div>
  );
}
