/* ==========================================================================
   OUR STORY ✨ - PROGRESSIVE WEB APP SERVICE WORKER
   Himanshu & Gullu Couple App
   ========================================================================== */

const CACHE_NAME = 'our-story-v27';

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './styles.css?v=32',
  './script.js?v=32',
  './paho-mqtt.min.js',
  './manifest.json',
  './version.json',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png'
];

// 1. Install & Precache App Shell
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn('PWA: Some assets could not be precached', err);
      });
    })
  );
});

// 2. Activate & Clean Old Asset Caches (User data in localStorage is NEVER touched)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Fetch Strategy
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Bypass service worker cache for API requests (keep live sync real-time)
  if (url.pathname.startsWith('/api/')) {
    return;
  }

  // HTML navigation: Network first, fallback to cached index.html
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Static Assets: Stale-While-Revalidate
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});

// 4. Listen for User Triggered Update ('SKIP_WAITING')
self.addEventListener('message', (event) => {
  if (event.data && (event.data.type === 'SKIP_WAITING' || event.data.action === 'skipWaiting')) {
    self.skipWaiting();
  }
});

// 5. Notification Click Handler - Focus app or open heartbeat tab
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const rawUrl = (event.notification.data && event.notification.data.url) ? event.notification.data.url : './#pulse';
  const baseScope = (self.registration && self.registration.scope)
    ? self.registration.scope
    : (self.location.origin + '/our-story/');
  const urlToOpen = new URL(rawUrl, baseScope).href;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url && 'focus' in client) {
          if ('navigate' in client) {
            try { client.navigate(urlToOpen); } catch (e) {}
          }
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// 6. Push Event Handler (Web Push payloads when app is closed / phone locked)
// Deduplication cache in SW memory (retains last 100 push IDs)
const recentPushIds = new Set();

self.addEventListener('push', (event) => {
  let title = '💓 Dil Ki Dhadkan Received!';
  let body = 'Partner ne dil ki dhadkan bheji hai! Jaldi app kholo ❤️';
  let clickUrl = './#pulse';
  let pushId = null;
  let pushTag = null;

  if (event.data) {
    try {
      const payload = event.data.json();
      if (payload.title) title = payload.title;
      if (payload.message) body = payload.message;
      else if (payload.body) body = payload.body;
      if (payload.click) clickUrl = payload.click;
      pushId = payload.id;
      pushTag = payload.tag;
    } catch (e) {
      try {
        const text = event.data.text();
        if (text) body = text;
      } catch (err) {}
    }
  }

  // Deduplicate push notifications by ID or content hash
  const dedupeKey = pushId || (title + '::' + body);
  if (recentPushIds.has(dedupeKey)) {
    console.log('SW: Suppressing duplicate push notification:', dedupeKey);
    return;
  }
  recentPushIds.add(dedupeKey);
  if (recentPushIds.size > 100) {
    const first = recentPushIds.values().next().value;
    recentPushIds.delete(first);
  }

  const baseScope = (self.registration && self.registration.scope)
    ? self.registration.scope
    : (self.location.origin + '/our-story/');
  const finalClickUrl = new URL(clickUrl, baseScope).href;

  const options = {
    body: body,
    icon: './icon-192.png',
    badge: './icon-192.png',
    vibrate: [300, 100, 300, 100, 600],
    tag: pushTag || ('notif_' + dedupeKey),
    renotify: false, // Prevents re-alerting if notification is already shown
    requireInteraction: true,
    data: { url: finalClickUrl }
  };

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // If the app is already open and focused in the foreground, don't double-buzz with a push banner
      const isAppFocused = windowClients.some(c => c.visibilityState === 'visible' && c.focused);
      if (isAppFocused) {
        console.log('SW: App is currently active and focused in foreground, skipping background push alert');
        return;
      }
      return self.registration.showNotification(title, options);
    })
  );
});
