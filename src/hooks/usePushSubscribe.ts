'use client';

import { useCallback, useEffect, useState } from 'react';

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

export type PushStatus = 'unknown' | 'unsupported' | 'default' | 'granted' | 'denied';

/** Shared push-subscription logic so any surface (the post-quiz toast, the
 * Daily Challenge banner, etc.) can offer its own subscribe CTA without
 * duplicating the permission/subscribe/POST flow. */
export function usePushSubscribe() {
  const [status, setStatus] = useState<PushStatus>('unknown');

  useEffect(() => {
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      setStatus('unsupported');
      return;
    }
    setStatus(Notification.permission as PushStatus);
  }, []);

  const subscribe = useCallback(async (eventParams: Record<string, unknown> = {}): Promise<boolean> => {
    try {
      const permission = await Notification.requestPermission();
      setStatus(permission as PushStatus);
      if (permission !== 'granted') {
        if (typeof window.gtag === 'function') window.gtag('event', 'push_subscribe_denied', eventParams);
        return false;
      }

      const reg = await navigator.serviceWorker.ready;
      const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!publicKey) return false;

      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey).buffer as ArrayBuffer,
      });

      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription),
      });
      if (typeof window.gtag === 'function') window.gtag('event', 'push_subscribe', eventParams);
      return true;
    } catch (err) {
      console.warn('Push subscription failed:', err);
      return false;
    }
  }, []);

  return { status, subscribe };
}
