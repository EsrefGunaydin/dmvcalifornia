'use client';

import { useEffect } from 'react';
import { Youtube } from 'lucide-react';
import { YOUTUBE_CHANNEL_URL } from '@/lib/constants';

interface YouTubeCTAProps {
  variant: 'subscribe' | 'watch-embed';
  compact?: boolean;
  className?: string;
  channelUrl?: string;
  videoId?: string;
  heading?: string;
  subtitle?: string;
  source?: string;
  topic?: string;
  quizId?: string | number;
}

export default function YouTubeCTA({
  variant,
  compact = false,
  className = '',
  channelUrl = YOUTUBE_CHANNEL_URL,
  videoId,
  heading,
  subtitle,
  source,
  topic,
  quizId,
}: YouTubeCTAProps) {
  useEffect(() => {
    if (variant !== 'watch-embed') return;
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', 'youtube_cta_impression', {
      video_id: videoId,
      source,
      topic,
      quiz_id: quizId,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const trackClick = () => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'youtube_cta_click', { variant, source });
    }
  };

  if (variant === 'watch-embed' && videoId) {
    return (
      <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
        <h3 className="font-bold text-gray-900 text-lg mb-1">
          {heading || 'Watch a quick explainer'}
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          {subtitle || 'See the answers explained before you retake the test.'}
        </p>
        <div className="relative w-full rounded-xl overflow-hidden shadow border border-gray-200" style={{ paddingBottom: '56.25%' }}>
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
            title={heading || 'DMV California practice test video'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <a
        href={channelUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={trackClick}
        className={`inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-red-600 text-sm font-semibold rounded-lg px-4 py-2.5 shadow-sm transition-colors flex-shrink-0 ${className}`}
      >
        <Youtube className="w-5 h-5" />
        {heading || 'Subscribe'}
      </a>
    );
  }

  return (
    <div className={`bg-gradient-to-br from-red-50 to-white border-2 border-red-200 rounded-xl shadow-lg p-4 ${className}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <Youtube className="w-5 h-5 text-red-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-gray-900 text-sm">{heading || 'Subscribe on YouTube'}</h4>
          <p className="text-xs text-gray-600">{subtitle || 'Free practice test walkthroughs'}</p>
        </div>
      </div>
      <a
        href={channelUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={trackClick}
        className="block text-center bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg px-4 py-2 transition-colors"
      >
        Subscribe
      </a>
    </div>
  );
}
