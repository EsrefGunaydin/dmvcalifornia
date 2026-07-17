'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

interface SiteStats {
  peoplePracticed: number;
}

/**
 * Real, site-wide view count (base estimate + live tracked views), not a
 * randomized or synthetic figure, and not based on leaderboard submissions
 * (that form is opt-in and most people who finish a test skip it, so it
 * would undercount real activity). Renders nothing until the numbers load
 * so there's no placeholder/fake value shown, and nothing at all if the
 * count is too low to be a meaningful signal.
 */
export default function SiteActivityBadge() {
  const [stats, setStats] = useState<SiteStats | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/stats/site')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data) setStats(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  if (!stats || stats.peoplePracticed < 50) return null;

  return (
    <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-800 text-base font-medium px-4 py-2.5 rounded-full">
      <span className="relative flex h-3 w-3 flex-shrink-0 items-center justify-center">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500" />
      </span>
      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
      <span className="leading-none">
        {stats.peoplePracticed.toLocaleString()}+ people have practiced our tests
      </span>
    </div>
  );
}
