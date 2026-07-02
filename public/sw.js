// Service worker for DMV California push notifications

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(clients.claim()));

self.addEventListener('push', (event) => {
  if (!event.data) return;
  let data;
  try { data = event.data.json(); } catch { data = { title: 'DMV California', body: event.data.text() }; }

  const title = data.title || 'DMV California';
  const options = {
    body: data.body || 'You have a new update.',
    icon: '/images/dmv-logo.png',
    badge: '/images/dmv-logo.png',
    tag: data.tag || 'dmv-notification',
    data: { url: data.url || '/practice-test' },
    requireInteraction: false,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || '/practice-test';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
