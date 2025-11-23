// service-worker.js
const CACHE_NAME = "cosmic-clicker-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/style.css",
  "/main.js",
  "/systems.js",
  "/ui.js",
  "/manifest.json",
  "/assets/mascot.png",
  "/audio/background.mp3",
  "/audio/tap.mp3",
  "/audio/mascot-chime.mp3",
  "/icons/icon-48.png",
  "/icons/icon-96.png",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/data/upgrades.json",
  "/data/items.json",
  "/data/achievements.json",
  "/data/events.json"
];

// Install SW and cache files
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate SW and clean old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(name => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    })
  );
});

// Fetch handler
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return (
        response ||
        fetch(event.request).then(fetchResponse => {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        })
      );
    })
  );
});
