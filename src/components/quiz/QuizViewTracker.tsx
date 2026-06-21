'use client';

import { useEffect, useState, useRef } from 'react';

interface QuizViewTrackerProps {
  quizId: string | number;
  /** Base estimate; live views are added on top. */
  baseViews: number;
}

export default function QuizViewTracker({ quizId, baseViews }: QuizViewTrackerProps) {
  const [liveViews, setLiveViews] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const hasTracked = useRef(false);

  useEffect(() => {
    setIsMounted(true);
    if (hasTracked.current) return;

    const key = `quiz_view_tracked_${quizId}`;
    const already = sessionStorage.getItem(key);

    const readOnly = async () => {
      try {
        const res = await fetch(`/api/quiz-views?quizId=${encodeURIComponent(String(quizId))}`);
        if (res.ok) setLiveViews((await res.json()).views ?? 0);
      } catch {
        setLiveViews(0);
      }
    };

    if (already) {
      readOnly();
      return;
    }

    hasTracked.current = true;
    (async () => {
      try {
        const res = await fetch('/api/quiz-views', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quizId }),
        });
        if (res.ok) {
          setLiveViews((await res.json()).views ?? 0);
          sessionStorage.setItem(key, 'true');
        } else {
          setLiveViews(0);
        }
      } catch {
        setLiveViews(0);
      }
    })();
  }, [quizId]);

  // Avoid hydration mismatch: render the base count on the server/first paint,
  // then add the live count once it loads.
  const total = baseViews + (isMounted && liveViews !== null ? liveViews : 0);

  return (
    <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-500">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.723 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
      <span>{total.toLocaleString()} total views</span>
    </div>
  );
}
