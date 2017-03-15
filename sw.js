var CACHE_NAME = 'GGCMaps-cache-v1.0';
var urlsToCache = [
  '/ggcmaps/Building/A/First-Floor.html',
  '/ggcmaps/Building/B/first-floor.html',
  '/ggcmaps/Building/B/second-floor.html',
  '/ggcmaps/Building/B/third-floor.html',
  '/ggcmaps/Building/C/First-Floor.html',
  '/ggcmaps/Building/C/Second-Floor.html',
  '/ggcmaps/Building/C3/Ground-Floor.html',
  '/ggcmaps/Building/C3/First-Floor.html',
  '/ggcmaps/Building/C3/Second-Floor.html',
  '/ggcmaps/Building/D/First-Floor.html',
  '/ggcmaps/Building/D/Second-Floor.html',
  '/ggcmaps/Building/E/First-Floor.html',
  '/ggcmaps/Building/E/Second-Floor.html',
  '/ggcmaps/Building/E/Third-Floor.html',
  '/ggcmaps/Building/F/First-Floor.html',
  '/ggcmaps/Building/F/Second-Floor.html',
  '/ggcmaps/Building/H/First-Floor.html',
  '/ggcmaps/Building/H/Second-Floor.html',
  '/ggcmaps/Building/H/Third-Floor.html',
  '/ggcmaps/Building/I/First-Floor.html',
  '/ggcmaps/Building/I/Second-Floor.html',
  '/ggcmaps/Building/I/Third-Floor.html',
  '/ggcmaps/Building/L/First-Floor.html',
  '/ggcmaps/Building/L/Second-Floor.html',
  '/ggcmaps/Building/L/Third-Floor.html',
  '/ggcmaps/css/',
  '/ggcmaps/images/',
  '/ggcmaps/js/script.min.js',
  '/ggcmaps/index.html',
  '/ggcmaps/devs.html',
  '/ggcmaps/help.html'
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
