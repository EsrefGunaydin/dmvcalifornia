'use client';

import { useEffect, useState } from 'react';
import { Bell, X } from 'lucide-react';

const PROMPT_KEY = 'push-permission-prompted';

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

interface PushPermissionPromptProps {
  streak: number;
}

export default function PushPermissionPrompt({ streak }: PushPermissionPromptProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!('Notification' in window) || !('serviceWorker' in navigator)) return;
    if (Notification.permission !== 'default') return; // already granted or denied
    if (sessionStorage.getItem(PROMPT_KEY)) return;    // already shown this session
    if (streak < 1) return;
    // Short delay so it doesn't pop up the instant the results render
    const t = setTimeout(() => setShow(true), 2000);
    return () => clearTimeout(t);
  }, [streak]);

  const dismiss = () => {
    sessionStorage.setItem(PROMPT_KEY, '1');
    setShow(false);
  };

  const handleAllow = async () => {
    sessionStorage.setItem(PROMPT_KEY, '1');
    setShow(false);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') return;

      const reg = await navigator.serviceWorker.ready;
      const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!publicKey) return;

      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey).buffer as ArrayBuffer,
      });

      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription),
      });
    } catch (err) {
      console.warn('Push subscription failed:', err);
    }
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
            Keep your {streak}-day streak
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
