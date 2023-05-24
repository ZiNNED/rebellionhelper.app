// Files to cache
const cacheName = 'swrh-v1.11';
const appShellFiles = [
  '/',
  '/index.html',
  '/content/css/lightsaber.min.css',
  '/content/css/main.min.css',
  '/content/css/svg.css',
  '/content/images/build.svg',
  '/content/images/empire.svg',
  '/content/images/rebels.svg',
  '/content/images/hyades.jpg',
  '/content/images/favicon32.png',
  '/content/images/favicon64.png',
  '/content/images/favicon128.png',
  '/content/images/favicon256.png',
  '/content/images/favicon512.png',
  '/content/js/modernizr.min.js',
  '/content/js/rebellion.min.js',
  '/content/misc/lightsaber-off.mp3',
  '/content/misc/lightsaber-on.mp3'
];

// Installing Service Worker
self.addEventListener('install', (e) => {
  console.log('[Service Worker] Install');
  e.waitUntil((async () => {
    const cache = await caches.open(cacheName);
    console.log('[Service Worker] Caching all: app shell and content');
    await cache.addAll(appShellFiles);
  })());
});

// Fetching content using Service Worker
self.addEventListener('fetch', (e) => {
    // Cache http and https only, skip unsupported chrome-extension:// and file://...
    if (!(
       e.request.url.startsWith('http:') || e.request.url.startsWith('https:')
    )) {
        return; 
    }

  e.respondWith((async () => {
    const r = await caches.match(e.request);
    console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
    if (r) return r;
    const response = await fetch(e.request);
    const cache = await caches.open(cacheName);
    console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
    cache.put(e.request, response.clone());
    return response;
  })());
});