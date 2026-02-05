const CACHE = 'piano-v1';
self.addEventListener('install', e =>
  e.waitUntil(
    caches.open(CACHE).then(c =>
      c.addAll(['./','./index.html','./3.png'])
    )
  )
);

self.addEventListener('fetch', e =>
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  )
);
