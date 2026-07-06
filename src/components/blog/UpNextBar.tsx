'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, X } from 'lucide-react';

interface UpNextBarProps {
  post: {
    slug: string;
    title: string;
  };
}

/**
 * Compact bottom bar that slides in once the reader is 60% through an
 * article, offering the best related post. Hides again when the reader
 * reaches the end-of-article zone (#article-end-sentinel) so it never
 * covers the multiplex ad, related stories, prev/next cards, or footer —
 * those already provide the same links. Also yields to QuizPromotionPopup
 * (which sets data-quiz-popup-open on <html>) so the two never stack.
 */
export default function UpNextBar({ post }: UpNextBarProps) {
  const [scrolledEnough, setScrolledEnough] = useState(false);
  const [inEndZone, setInEndZone] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('upNextBarDismissed')) {
      setDismissed(true);
      return;
    }

    const handleScroll = () => {
      setPopupOpen(Boolean(document.documentElement.dataset.quizPopupOpen));
      const scrollPercentage =
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercentage >= 60) {
        setScrolledEnough(true);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Hide while the end-of-article zone is on screen or above it (reader is
    // in the related-links/footer region); show again if they scroll back up
    // into the article body.
    const sentinel = document.getElementById('article-end-sentinel');
    let observer: IntersectionObserver | undefined;
    if (sentinel) {
      observer = new IntersectionObserver(
        ([entry]) => {
          setInEndZone(entry.isIntersecting || entry.boundingClientRect.bottom < 0);
        },
        { rootMargin: '0px 0px 120px 0px' }
      );
      observer.observe(sentinel);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer?.disconnect();
    };
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem('upNextBarDismissed', 'true');
  };

  const handleClick = () => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'up_next_bar_click', { next_post: post.slug });
    }
  };

  const isVisible = scrolledEnough && !inEndZone && !popupOpen && !dismissed;
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-[99999] animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-white border-t-2 border-primary/30 shadow-[0_-4px_12px_rgba(0,0,0,0.08)]">
        <div className="container mx-auto px-4 py-3 flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">Up next</p>
            <Link
              href={`/${post.slug}`}
              onClick={handleClick}
              className="block font-bold text-gray-900 truncate hover:text-primary transition-colors"
            >
              {post.title}
            </Link>
          </div>
          <Link
            href={`/${post.slug}`}
            onClick={handleClick}
            className="flex-shrink-0 inline-flex items-center gap-1.5 bg-primary text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-primary-600 transition-colors"
          >
            Read next
            <ArrowRight className="w-4 h-4" />
          </Link>
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Dismiss"
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
