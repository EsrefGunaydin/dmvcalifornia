'use client';

import { useEffect, useState } from 'react';
import { Bell, X } from 'lucide-react';
import { usePushSubscribe } from '@/hooks/usePushSubscribe';

const PROMPT_KEY = 'push-permission-prompted';

interface PushPermissionPromptProps {
  streak: number;
}

export default function PushPermissionPrompt({ streak }: PushPermissionPromptProps) {
  const [show, setShow] = useState(false);
  const { status, subscribe } = usePushSubscribe();

  useEffect(() => {
    if (status !== 'default') return; // unsupported, already granted, or already denied
    if (sessionStorage.getItem(PROMPT_KEY)) return; // already shown this session
    // No streak minimum: first-time completions are worth prompting too,
    // sessionStorage above already caps this to once per browser session.
    // Short delay so it doesn't pop up the instant the results render
    const t = setTimeout(() => {
      setShow(true);
      if (typeof window.gtag === 'function') window.gtag('event', 'push_prompt_shown', { streak, source: 'quiz_results' });
    }, 2000);
    return () => clearTimeout(t);
  }, [status, streak]);

  const dismiss = () => {
    sessionStorage.setItem(PROMPT_KEY, '1');
    setShow(false);
    if (typeof window.gtag === 'function') window.gtag('event', 'push_prompt_dismissed', { streak, source: 'quiz_results' });
  };

  const handleAllow = async () => {
    sessionStorage.setItem(PROMPT_KEY, '1');
    setShow(false);
    await subscribe({ streak, source: 'quiz_results' });
  };

  if (!show) return null;

  return (
    <div className="fixed top-4 right-4 left-4 sm:left-auto sm:w-[420px] z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 p-6">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Bell className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 text-base mb-1">
            {streak >= 1 ? `Keep your ${streak}-day streak` : 'Get a daily study reminder'}
          </p>
          <p className="text-sm text-gray-600 mb-5">
            Get a reminder if you forget to practice tomorrow. One notification, no spam.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleAllow}
              className="flex-1 bg-primary text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Allow
            </button>
            <button
              onClick={dismiss}
              className="flex-1 bg-gray-100 text-gray-700 text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-gray-200 transition-colors"
            >
              No thanks
            </button>
          </div>
        </div>
        <button onClick={dismiss} className="flex-shrink-0 text-gray-400 hover:text-gray-600">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
