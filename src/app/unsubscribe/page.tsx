'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const email = searchParams.get('email');
    const token = searchParams.get('token');
    if (!email || !token) { setStatus('error'); return; }

    fetch(`/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`)
      .then((r) => setStatus(r.ok ? 'success' : 'error'))
      .catch(() => setStatus('error'));
  }, [searchParams]);

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 max-w-md w-full text-center">
        {status === 'loading' && (
          <p className="text-gray-500 text-sm">Processing...</p>
        )}
        {status === 'success' && (
          <>
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">You have been unsubscribed</h1>
            <p className="text-gray-500 text-sm mb-6">
              You will not receive any more emails from DMV California.
            </p>
            <Link
              href="/practice-test"
              className="inline-block bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-600 transition-colors"
            >
              Back to practice tests
            </Link>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Invalid link</h1>
            <p className="text-gray-500 text-sm mb-6">
              This unsubscribe link is invalid or has expired. Contact us if you need help.
            </p>
            <Link href="/" className="text-sm text-primary hover:underline">Go to homepage</Link>
          </>
        )}
      </div>
    </main>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-gray-400 text-sm">Loading...</p></main>}>
      <UnsubscribeContent />
    </Suspense>
  );
}
