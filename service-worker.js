const CACHE_NAME = 'app-cache-v1';
const OFFLINE_URLS = ['index.html', 'uebung_page.html'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return Promise.all(
          OFFLINE_URLS.map(url => {
            return fetch(url).then(response => {
              if (!response.ok) {
                throw new TypeError('Failed to fetch ' + url);
              }
              return cache.put(url, response);
            });
          })
        );
      })
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Bereitstellung der Datei hallo.txt
  if (url.pathname === '/hallo.txt') {
    const response = new Response('Dies ist der Inhalt von hallo.txt', {
      headers: { 'Content-Type': 'text/plain' }
    });
    event.respondWith(response);
    return;
  }

  // Stale-While-Revalidate für test.json
  if (url.pathname === '/test.json') {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        return cache.match(event.request).then(cachedResponse => {
          const fetchPromise = fetch(event.request).then(networkResponse => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  // Offline-Unterstützung für Navigationen
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('index.html');
      })
    );
    return;
  }

  // Standardverhalten für alle anderen Anfragen
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return cachedResponse || fetch(event.request);
    })
  );

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('service-worker.js').then(function (registration) {
        // Registration was successful
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      }, function (err) {
        // registration failed :(
        console.log('ServiceWorker registration failed: ', err);
      });
    });
  }
});

// Notification Click Event Listener
self.addEventListener('notificationclick', event => {
  event.notification.close(); // Schließt die Benachrichtigung
  if (event.action === 'action1') {
    console.log('Aktion Oben wurde geklickt');
    // Hier können Sie eine spezifische Aktion ausführen
    clients.openWindow('https://www-user.tu-chemnitz.de/~kevwe/index.html'); // Beispielaktion: Fenster öffnen
  } else if (event.action === 'action2') {
    console.log('Aktion Unten wurde geklickt');
    // Hier können Sie eine spezifische Aktion ausführen
    clients.openWindow('https://www-user.tu-chemnitz.de/~kevwe/index.html'); // Beispielaktion: Fenster öffnen
  } else {
    console.log('Benachrichtigung selbst wurde geklickt');
    // Hier können Sie eine spezifische Aktion ausführen, wenn die Benachrichtigung selbst geklickt wird
    clients.openWindow('https://www-user.tu-chemnitz.de/~kevwe/index.html'); // Beispielaktion: Fenster öffnen
  }
});
