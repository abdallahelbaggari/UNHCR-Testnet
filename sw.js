/* Humanitarian Hub TESTNET — SW Self-Destruct v10
   sandbox:true — Test environment */
self.addEventListener('install', function(e) {
  self.skipWaiting();
});
self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.map(function(k) { return caches.delete(k); }));
    })
    .then(function() { return self.clients.claim(); })
    .then(function() { return self.registration.unregister(); })
  );
});
self.addEventListener('fetch', function(e) {
  if (e.request.method === 'GET') {
    e.respondWith(fetch(e.request, {cache: 'no-store'}).catch(function() { return fetch(e.request); }));
  }
});
