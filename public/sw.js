const CACHE_VERSION = 'heritage-cookbook-v5';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const IMAGE_CACHE = `${CACHE_VERSION}-images`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;

// Resolve paths against the service worker scope so the app works from a
// sub-path (e.g. GitHub Pages at /Cookbook/) as well as a root domain.
const scopeUrl = (path) => new URL(path, self.registration.scope).href;

const PRECACHE_ASSETS = [
  './',
  'index.html',
  'manifest.webmanifest',
  'apple-touch-icon.png',
  'icon-192.png',
  'icon-512.png',
  'favicon.png',
  'favicon.svg'
].map(scopeUrl);

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('Pre-cache warning (some files may be lazy):', err);
      });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => !key.startsWith(CACHE_VERSION))
          .map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle GET requests
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Update checks from the app (see AppUpdateContext): always straight to the network, never cached.
  if (url.searchParams.has('__v')) return;

  // 1. Image Caching Strategy: Cache First, then Network
  if (
    request.destination === 'image' ||
    url.hostname.includes('unsplash.com') ||
    url.pathname.match(/\.(png|jpg|jpeg|svg|webp|gif)$/)
  ) {
    event.respondWith(
      caches.open(IMAGE_CACHE).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return fetch(request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                cache.put(request, networkResponse.clone());
              }
              return networkResponse;
            })
            .catch(() => {
              // Return a fallback or nothing if network fails and not in cache
              return cachedResponse || Response.error();
            });
        });
      })
    );
    return;
  }

  // 2. Google Fonts: Cache First, long lived
  if (
    url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('fonts.gstatic.com')
  ) {
    event.respondWith(
      caches.open(STATIC_CACHE).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          return fetch(request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          });
        });
      })
    );
    return;
  }

  // 3. Navigation / HTML requests: Network first with cache fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put(request, clone));
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match(scopeUrl('index.html')).then((r) => r || caches.match(scopeUrl('./')));
        })
    );
    return;
  }

  // 4. Default: Stale-While-Revalidate
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            (url.origin === self.location.origin)
          ) {
            const clone = networkResponse.clone();
            caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, clone));
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});

// Phone alerts: a pop-up when someone comments on or reacts to your photo. The message is sent by the
// scheduled GitHub job in tools/push (see docs/PHONE_ALERTS_SETUP.md).
self.addEventListener('push', (event) => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch (e) { /* plain text or empty */ }
  event.waitUntil(
    self.registration.showNotification(data.title || 'Heritage Cookbook', {
      body: data.body || 'Something new on your photos.',
      icon: scopeUrl('icon-192.png'),
      badge: scopeUrl('icon-192.png'),
      tag: data.tag || 'cookbook-notice',
      renotify: true,
      data: { url: scopeUrl('./') }
    })
  );
});

// Tapping the pop-up brings the cookbook to the front (or opens it); the bell inside shows what happened.
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = (event.notification.data && event.notification.data.url) || scopeUrl('./');
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if (client.url.startsWith(self.registration.scope) && 'focus' in client) return client.focus();
      }
      return self.clients.openWindow(target);
    })
  );
});
