var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
  '/Building/',
  '/Building/A/First-Floor.html',
  '/Building/B/first-floor.html',
  '/Building/B/second-floor.html',
  '/Building/B/third-floor.html',
  '/Building/C/First-Floor.html',
  '/Building/C/Second-Floor.html',
  '/Building/C3/Ground-Floor.html',
  '/Building/C3/First-Floor.html',
  '/Building/C3/Second-Floor.html',
  '/Building/D/First-Floor.html',
  '/Building/D/Second-Floor.html',
  '/Building/E/First-Floor.html',
  '/Building/E/Second-Floor.html',
  '/Building/E/Third-Floor.html',
  '/Building/F/First-Floor.html',
  '/Building/F/Second-Floor.html',
  '/Building/H/First-Floor.html',
  '/Building/H/Second-Floor.html',
  '/Building/H/Third-Floor.html',
  '/Building/I/First-Floor.html',
  '/Building/I/Second-Floor.html',
  '/Building/I/Third-Floor.html',
  '/Building/L/First-Floor.html',
  '/Building/L/Second-Floor.html',
  '/Building/L/Third-Floor.html',
  '/css/',
  '/images/',
  '/js/script.min.js',
  '/'
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
