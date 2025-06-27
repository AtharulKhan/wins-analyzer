
const CACHE_NAME = 'wins-tracker-v3';
const STATIC_CACHE = 'wins-tracker-static-v3';
const RUNTIME_CACHE = 'wins-tracker-runtime-v3';

const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

// Install event - cache essential resources
self.addEventListener('install', function(event) {
  console.log('Service Worker installing with cache version:', CACHE_NAME);
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(function(cache) {
        console.log('Caching static resources');
        return cache.addAll(urlsToCache);
      })
      .then(function() {
        // Skip waiting to activate immediately
        return self.skipWaiting();
      })
      .catch(function(error) {
        console.error('Cache installation failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', function(event) {
  console.log('Service Worker activating');
  
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== STATIC_CACHE && cacheName !== RUNTIME_CACHE) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(function() {
      // Claim all clients immediately
      return self.clients.claim();
    }).then(function() {
      console.log('Service Worker activated');
    })
  );
});

// Fetch event - implement cache strategies
self.addEventListener('fetch', function(event) {
  const request = event.request;
  const url = new URL(request.url);
  
  // Skip caching for API requests and external domains
  if (url.pathname.startsWith('/api/') || url.origin !== location.origin) {
    event.respondWith(fetch(request));
    return;
  }
  
  // Network-first strategy for HTML documents (navigation requests)
  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(
      fetch(request)
        .then(function(response) {
          // If successful, update cache and return response
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(RUNTIME_CACHE).then(function(cache) {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(function(error) {
          console.log('Network request failed, trying cache:', error);
          // Fallback to cache, then to index.html
          return caches.match(request)
            .then(function(cachedResponse) {
              if (cachedResponse) {
                return cachedResponse;
              }
              // Final fallback to index.html for SPA routing
              return caches.match('/');
            });
        })
    );
    return;
  }
  
  // Cache-first strategy for static assets (JS, CSS, images)
  if (request.destination === 'script' || 
      request.destination === 'style' || 
      request.destination === 'image' ||
      request.destination === 'font') {
    event.respondWith(
      caches.match(request)
        .then(function(cachedResponse) {
          if (cachedResponse) {
            // Update cache in background
            fetch(request).then(function(response) {
              if (response.status === 200) {
                const responseClone = response.clone();
                caches.open(STATIC_CACHE).then(function(cache) {
                  cache.put(request, responseClone);
                });
              }
            }).catch(function() {
              // Silently fail background updates
            });
            return cachedResponse;
          }
          
          // Not in cache, fetch from network
          return fetch(request).then(function(response) {
            if (response.status === 200) {
              const responseClone = response.clone();
              caches.open(STATIC_CACHE).then(function(cache) {
                cache.put(request, responseClone);
              });
            }
            return response;
          });
        })
    );
    return;
  }
  
  // Default: network-first for everything else
  event.respondWith(
    fetch(request)
      .then(function(response) {
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(RUNTIME_CACHE).then(function(cache) {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(function() {
        return caches.match(request);
      })
  );
});

// Handle service worker updates
self.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Error handling
self.addEventListener('error', function(event) {
  console.error('Service Worker error:', event.error);
});

self.addEventListener('unhandledrejection', function(event) {
  console.error('Service Worker unhandled rejection:', event.reason);
});
