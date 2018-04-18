const CACHE_NAME = 'cache-v1';
// 事先设置好需要进行更新的文件路径
const urlsToPrefetch = [
  '/',
  '/index.html',
  '/sw.css',
  '/main.js',
  '/pics/cat.jpg',
  '/pics/dog.jpg',
  '/pics/no.jpg'
];

// Perform install steps
self.addEventListener('install', function(event) {
  console.log(`${CACHE_NAME} installing…`);
  // skip waiting
  // self.skipWaiting()

  // cache files
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('opened cache');
        return cache.addAll(urlsToPrefetch);
      })
    );

  // // prefetch
  // const now = Date.now();
  // event.waitUntil(
  //   caches.open(CACHE_NAME).then(function(cache) {
  //     const cachePromises = urlsToPrefetch.map(function(urlToPrefetch) {
  //       console.log('prefetch');
  //     // 使用 url 对象进行路由拼接
  //       const url = new URL(urlToPrefetch, location.href);
  //       url.search += (url.search ? '&' : '?') + 'cache-bust=' + now;
  //       // 创建 request 对象进行流量的获取
  //       const request = new Request(url, {mode: 'no-cors'});
  //       // 手动发送请求，用来进行文件的更新
  //       return fetch(request).then(function(response) {
  //         if (response.status >= 400) {
  //           // 解决请求失败时的情况
  //           throw new Error('request for ' + urlToPrefetch +
  //             ' failed with status ' + response.statusText);
  //         }
  //         // 将成功后的 response 流，存放在 caches 套件中，完成指定文件的更新。
  //         return cache.put(urlToPrefetch, response);
  //       }).catch(function(error) {
  //         console.error('Not caching ' + urlToPrefetch + ' due to ' + error);
  //       });
  //     });

  //     return Promise.all(cachePromises).then(function() {
  //       console.log('Pre-fetching complete.');
  //     });
  //   }).catch(function(error) {
  //     console.error('Pre-fetching failed:', error);
  //   })
  // );
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
  // // 优化的 prefech 每次都会去取新的数据，但是要到下次刷新才能更新
  // event.respondWith(
  //   caches.open(CACHE_NAME).then(function(cache) {
  //     return cache.match(event.request).then(function(response) {
  //       var fetchPromise = fetch(event.request).then(function(networkResponse) {
  //         if(!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
  //           return networkResponse;
  //         }
  //         cache.put(event.request, networkResponse.clone());
  //         return networkResponse;
  //       })
  //       return response || fetchPromise;
  //     })
  //   }));

  event.respondWith(caches.match(event.request)
    .then(function(response) {
      if (response !== undefined) {
        // if(event.request.clone().url.indexOf('cat.jpg') !== -1) {
        //   return caches.match('/pics/no.jpg');
        // }
        return response;
      }

      const fetchRequest = event.request.clone();
      return fetch(fetchRequest)
        .then(response => {
          // Check if we received a valid response
          if(!response || response.status !== 200) return response;
          const responseClone = response.clone();
          caches.open(CACHE_NAME)
            .then(function (cache) {
              cache.put(event.request, responseClone);
            });
          return response;
        }).catch(function () {
          return caches.match('/pics/no.jpg');
        });
    }));
});
