'use client';

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

function GoogleAnalyticsTracker({ GA_MEASUREMENT_ID }: { GA_MEASUREMENT_ID: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;

    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');

    // Fire both: config (updates session context) + explicit page_view event.
    // GA4 does not reliably count config re-calls as page_view hits in the
    // Pages & Screens report; the explicit event ensures the view is recorded.
    const eventPayload = {
      page_path: url,
      page_location: window.location.href,
      page_title: document.title,
    };
    if (typeof window.gtag === 'function') {
      window.gtag('config', GA_MEASUREMENT_ID, { page_path: url });
      window.gtag('event', 'page_view', eventPayload);
    } else {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(['config', GA_MEASUREMENT_ID, { page_path: url }]);
      window.dataLayer.push(['event', 'page_view', eventPayload]);
    }
  }, [pathname, searchParams, GA_MEASUREMENT_ID]);

  return null;
}

export default function GoogleAnalytics({ GA_MEASUREMENT_ID }: { GA_MEASUREMENT_ID: string }) {
  return (
    <Suspense fallback={null}>
      <GoogleAnalyticsTracker GA_MEASUREMENT_ID={GA_MEASUREMENT_ID} />
    </Suspense>
  );
}
