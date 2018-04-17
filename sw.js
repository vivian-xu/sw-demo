const CACHE_NAME = 'cache-v2';

// Perform install steps
self.addEventListener('install', event => {
  console.log(`${CACHE_NAME} installing…`);
  
  // cache files
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
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


self.addEventListener('activate', event => {
  console.log(`${CACHE_NAME} now ready to handle fetches!`);
  // event.waitUntil(clients.claim());
});

self.addEventListener('fetch', event => {
  console.log('fetch');

  event.respondWith(caches.match(event.request)
    .then(function(response) {
      if (response !== undefined) {
        return response;
      } else {
        const fetchRequest = event.request.clone();
        return fetch(fetchRequest)
          .then(response => {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            let responseClone = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseClone);
              });

            return response;
          }).catch(() => caches.match('/pics/no.jpg'));
      }
    }));
});