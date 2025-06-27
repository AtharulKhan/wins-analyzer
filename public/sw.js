
const CACHE_NAME = 'wins-tracker-v4';
const STATIC_CACHE = 'wins-tracker-static-v4';
const RUNTIME_CACHE = 'wins-tracker-runtime-v4';

const urlsToCache = [
  '/',
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
        // Don't skip waiting automatically - let the user decide
        console.log('Service Worker installed, waiting for activation');
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
  
  // Skip caching for API requests, external domains, and node_modules
  if (url.pathname.startsWith('/api/') || 
      url.pathname.includes('/node_modules/') ||
      url.pathname.includes('?v=') ||
      url.origin !== location.origin) {
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
  
  // For JavaScript and CSS files, use network-first to avoid module import issues
  if (request.destination === 'script' || request.destination === 'style') {
    event.respondWith(
      fetch(request)
        .then(function(response) {
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(STATIC_CACHE).then(function(cache) {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(function() {
          // Only fallback to cache if network fails completely
          return caches.match(request);
        })
    );
    return;
  }
  
  // Cache-first strategy for images and fonts
  if (request.destination === 'image' || request.destination === 'font') {
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
