/* ==========================================================================
   OUR STORY ✨ - PROGRESSIVE WEB APP SERVICE WORKER
   Himanshu & Gullu Couple App
   ========================================================================== */

const CACHE_NAME = 'our-story-v7';

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './styles.css?v=11',
  './script.js?v=11',
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
