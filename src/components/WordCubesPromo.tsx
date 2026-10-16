'use client';

import Image from 'next/image';
import { Trophy, CalendarDays, Box } from 'lucide-react';

// Promotes Word Cubes 3D, our word puzzle game on the App Store. Shown where
// word-game players already are: the games hub and the DMVordle sidebar.
const APP_STORE_URL = 'https://apps.apple.com/us/app/word-cubes-3d/id6756241874';

// App Store Connect provider token (App Analytics > Campaigns > Generate a
// campaign link, the `pt` value). When set, every link carries a campaign
// named after its placement (ct=dmv_<placement>), so App Analytics shows
// impressions, downloads and proceeds per placement. Without it, downloads
// still show under Sources as the dmvcalifornia.us web referrer.
const PROVIDER_TOKEN = '';

function appStoreUrl(placement: string) {
  if (!PROVIDER_TOKEN) return APP_STORE_URL;
  const ct = `dmv_${placement}`.slice(0, 40);
  return `https://apps.apple.com/app/apple-store/id6756241874?pt=${PROVIDER_TOKEN}&ct=${ct}&mt=8`;
}

interface Props {
  variant?: 'sidebar' | 'wide';
  placement: string;
  className?: string;
}

export default function WordCubesPromo({ variant = 'sidebar', placement, className = '' }: Props) {
  const href = appStoreUrl(placement);
  const trackClick = () => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'word_cubes_promo_click', { placement, variant });
    }
  };

  const badge = (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={trackClick}
      className="inline-block hover:opacity-80 transition-opacity"
    >
      <Image src="/images/app-store-badge.svg" alt="Download Word Cubes 3D on the App Store" width={140} height={42} style={{ width: 140, height: 'auto' }} />
    </a>
  );

  const icon = (size: number) => (
    <a href={href} target="_blank" rel="noopener noreferrer" onClick={trackClick} className="flex-shrink-0" style={{ width: size }}>
      <Image
        src="/images/apps/word-cubes-icon.png"
        alt="Word Cubes 3D app icon"
        width={size}
        height={size}
        className="rounded-[22%] shadow-md"
        style={{ width: size, height: size, maxWidth: 'none' }}
      />
    </a>
  );

  if (variant === 'wide') {
    return (
      <div className={`bg-gradient-to-br from-amber-50 to-white border border-amber-200 rounded-2xl shadow-sm overflow-hidden ${className}`}>
        <div className="flex flex-col sm:flex-row items-center gap-5 p-6">
          {icon(96)}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
              <h2 className="text-xl font-bold text-gray-900">Word Cubes 3D</h2>
              <span className="text-xs font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">iPhone and iPad</span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              Like DMVordle? This is our word puzzle app. Roll letter cubes to spell words, guess one hidden word a
              day, and see where you rank on the Game Center leaderboards. Free to play, 200 levels.
            </p>
            {badge}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br from-amber-50 to-white border border-amber-200 rounded-xl shadow-sm p-5 ${className}`}>
      <div className="flex items-center gap-3 mb-3">
        {icon(56)}
        <div>
          <h3 className="font-bold text-gray-900">Word Cubes 3D</h3>
          <p className="text-xs text-amber-700">Our word game for iPhone and iPad</p>
        </div>
      </div>
      <p className="text-sm text-gray-700 leading-relaxed mb-3">
        Need a study break? Roll letter cubes to spell words, one level at a time.
      </p>
      <ul className="space-y-1.5 text-sm text-gray-600 mb-4">
        <li className="flex items-center gap-2"><Box className="w-4 h-4 text-amber-600 flex-shrink-0" />200 levels, free to play</li>
        <li className="flex items-center gap-2"><CalendarDays className="w-4 h-4 text-amber-600 flex-shrink-0" />A daily word with six tries</li>
        <li className="flex items-center gap-2"><Trophy className="w-4 h-4 text-amber-600 flex-shrink-0" />Game Center leaderboards</li>
      </ul>
      <div className="flex justify-center">{badge}</div>
    </div>
  );
}
