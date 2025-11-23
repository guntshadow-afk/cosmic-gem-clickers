const CACHE_NAME = 'cosmic-clicker-cache-v3';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './service-worker.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      if(cached) return cached;
      return fetch(e.request).then(resp => {
        // optionally cache new requests
        return resp;
      }).catch(()=> {
        // offline fallback: return index.html for navigation requests
        if(e.request.mode === 'navigate') return caches.match('./index.html');
      });
    })
  );
});
