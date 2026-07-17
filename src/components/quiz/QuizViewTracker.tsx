'use client';

import { useEffect, useState, useRef } from 'react';
import { Users } from 'lucide-react';

interface QuizViewTrackerProps {
  quizId: string | number;
  /** Base estimate; live views are added on top. */
  baseViews: number;
  /** 'prominent' renders a social-proof badge (for the top of the page);
   * default renders the original muted footer line. */
  variant?: 'footer' | 'prominent';
  /** Trailing phrase for the prominent badge, e.g. "have practiced this test"
   * or "have used this guide". */
  label?: string;
}

export default function QuizViewTracker({
  quizId,
  baseViews,
  variant = 'footer',
  label = 'have practiced this test',
}: QuizViewTrackerProps) {
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

  if (variant === 'prominent') {
    return (
      <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-800 text-sm font-semibold px-3.5 py-1.5 rounded-full">
        <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
        </span>
        <Users className="w-4 h-4 text-green-600 flex-shrink-0" />
        <span>{total.toLocaleString()}+ people {label}</span>
      </div>
    );
  }

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
