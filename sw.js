// Имя кэша
const CACHE_NAME = 'notes-pwa-v1';

// Файлы для кэширования
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

// Установка Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Кэшируем файлы для офлайн работы');
        return cache.addAll(urlsToCache);
      })
  );
});

// Активация
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Перехват запросов
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Если файл есть в кэше, возвращаем его
        if (response) {
          return response;
        }
        // Иначе загружаем из сети
        return fetch(event.request);
      })
  );
});
