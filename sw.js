const CACHE_NAME = 'gestia-cache-v1';
const urlsToCache = [
  './',
  './index.html'
];

// 1. Installation et mise en mémoire du site
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Fichiers mis en mémoire (Hors-ligne prêt)');
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. Le bouclier magique : Interception des requêtes
self.addEventListener('fetch', event => {
  event.respondWith(
    // On essaie de charger normalement. Si pas d'internet (erreur), on sort la mémoire cache !
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});

// 3. Nettoyage si on fait des mises à jour plus tard
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});