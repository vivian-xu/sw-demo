const CACHE_NAME = 'cache-v3';

// Perform install steps
self.addEventListener('install', function(event) {
  console.log(`${CACHE_NAME} installing…`);
  // skip waiting
  // self.skipWaiting()

  // cache files
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll([
          '/',
          '/index.html',
          '/sw.css',
          '/main.js',
          '/pics/cat.jpg',
          '/pics/dog.jpg',
          '/pics/no.jpg'
         ]);
      })
    );
});


// self.addEventListener('activate', event => {
//   console.log(`${CACHE_NAME} now ready to handle fetches!`);
//   // event.waitUntil(clients.claim());
// });

self.addEventListener('activate', function(event) {
  console.log('Activating new service worker...');
  // event.waitUntil(clients.claim());

  var cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  console.log('fetch');

  event.respondWith(caches.match(event.request)
    .then(function(response) {
      console.log('fetch');
      if (response !== undefined) {
        return response;
      } else {
        const fetchRequest = event.request.clone();
        console.log('fetchw ', event.request.clone());
        return fetch(fetchRequest)
          .then(response => {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            const responseClone = response.clone();

            caches.open(CACHE_NAME)
              .then(function (cache) {
                cache.put(event.request, responseClone);
              });
            return response;
          }).catch(function () {
            return caches.match('/pics/no.jpg');
          });
      }
    }));
});
