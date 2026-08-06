/* UNHCR.pi Service Worker v1.0 */
var CACHE = 'unhcr-v1';
var ASSETS = [
  '/',
  '/index.html',
  '/app.html',
  '/manifest.json',
  '/assets/icons/logo.svg',
  '/privacy-policy.html',
  '/terms-of-service.html'
];

self.addEventListener('install', function(e) {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(function(c) {
      return c.addAll(ASSETS).catch(function() {});
    })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.filter(function(k) {
        return k !== CACHE;
      }).map(function(k) {
        return caches.delete(k);
      }));
    }).then(function() {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function(e) {
  /* Only cache GET requests for same-origin assets */
  if (e.request.method !== 'GET') return;
  var url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;
  /* Network-first for HTML, cache-first for assets */
  if (url.pathname.endsWith('.html') || url.pathname === '/') {
    e.respondWith(
      fetch(e.request).then(function(r) {
        var rc = r.clone();
        caches.open(CACHE).then(function(c) { c.put(e.request, rc); });
        return r;
      }).catch(function() {
        return caches.match(e.request);
      })
    );
  } else {
    e.respondWith(
      caches.match(e.request).then(function(cached) {
        return cached || fetch(e.request).then(function(r) {
          var rc = r.clone();
          caches.open(CACHE).then(function(c) { c.put(e.request, rc); });
          return r;
        });
      })
    );
  }
});
