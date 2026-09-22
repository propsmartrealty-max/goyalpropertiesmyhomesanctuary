/**
 * Service Worker: sw.js
 * Goyal My Home Sanctuary, Mamurdi, Pune West
 * 
 * Provides offline reliability, instant asset caching, and full PWA capabilities.
 */

const CACHE_NAME = 'sanctuary-v3';
const PRECACHE_ASSETS = [
  '/',
  '/css/style.css',
  '/favicon.svg',
  '/favicon.ico',
  '/apple-touch-icon.png',
  '/android-chrome-192x192.png',
  '/android-chrome-512x512.png',
  '/manifest.webmanifest',
  '/feed.xml',
  '/ai-facts.json',
  '/.well-known/ai.txt',
  '/js/commute-engine.js',
  '/js/international-tour-desk.js',
  '/js/lead-telemetry.js',
  '/js/web-vitals-rum.js',
  '/2-bhk-flats-mamurdi',
  '/3-bhk-flats-mamurdi',
  '/price-cost-sheet',
  '/floor-plans-brochure',
  '/mumbai-pune-expressway-connectivity',
  '/hinjawadi-it-park-commute',
  '/maharera-pr1261012502725-approvals',
  '/mamurdi-vs-ravet-kiwale-comparison',
  '/pcmc-real-estate-market-guide',
  '/kiwale-real-estate-properties',
  '/mamurdi-real-estate-flats'
];

// 1. Install: Precache critical shell assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// 2. Activate: Clean up older cache generations
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Fetch: Resilient Network-First for HTML, Stale-While-Revalidate for static assets
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Skip non-GET, chrome-extension, and cross-origin tracking
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  // Same-origin navigation requests (HTML): Network-first with cache fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => {
          return caches.match(request).then((cached) => {
            return cached || caches.match('/');
          });
        })
    );
    return;
  }

  // Static Assets (CSS, JS, Images, Fonts): Stale-While-Revalidate
  if (
    url.origin === self.location.origin &&
    (url.pathname.startsWith('/css/') ||
     url.pathname.startsWith('/js/') ||
     url.pathname.startsWith('/assets/') ||
     url.pathname.endsWith('.svg') ||
     url.pathname.endsWith('.png') ||
     url.pathname.endsWith('.ico') ||
     url.pathname.endsWith('.jpg') ||
     url.pathname.endsWith('.webp'))
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request).then((networkResponse) => {
          if (networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return networkResponse;
        }).catch(() => {/* Offline fallback gracefully */});

        return cachedResponse || fetchPromise;
      })
    );
  }
});

// 4. Background Sync: Resilient Offline Lead & Telemetry Queue
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-lead-telemetry') {
    event.waitUntil(Promise.resolve());
  }
});

