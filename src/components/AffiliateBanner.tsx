'use client';

import { useEffect, useRef, useState } from 'react';
import { AFFILIATE_CREATIVES } from '@/config/affiliate-creatives';

/**
 * Renders an AWIN display creative in a labeled, centered container.
 *
 * - Returns null until a real "Copy Code" is pasted into the config, so it's
 *   safe to drop into pages ahead of time.
 * - Lazy-loads via IntersectionObserver (the AWIN image isn't fetched until the
 *   slot nears the viewport) to protect page speed.
 * - Reserves the slot height to avoid layout shift (CLS).
 * - Adds a "Sponsored" label (FTC + keeps it visually distinct from AdSense).
 */
export default function AffiliateBanner({
  creative,
  className = '',
}: {
  creative: keyof typeof AFFILIATE_CREATIVES | string;
  className?: string;
}) {
  const c = AFFILIATE_CREATIVES[creative as string];
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!c?.code) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: '300px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [c]);

  // Nothing to show until a real AWIN creative code is configured.
  if (!c || !c.code) return null;

  return (
    <div
      ref={ref}
      className={className}
      style={{ margin: '1.5rem auto', width: '100%', maxWidth: c.width, textAlign: 'center' }}
    >
      <div
        style={{
          fontSize: '0.625rem',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          color: '#9ca3af',
          marginBottom: 4,
        }}
      >
        Sponsored
      </div>
      <div
        style={{ minHeight: c.height }}
        dangerouslySetInnerHTML={visible ? { __html: c.code } : undefined}
      />
    </div>
  );
}
