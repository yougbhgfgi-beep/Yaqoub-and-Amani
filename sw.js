const CACHE = 'yaqoub-amani-v3';
const PRECACHE = [
  '/Yaqoub-and-Amani/',
  '/Yaqoub-and-Amani/index.html',
  '/Yaqoub-and-Amani/404.html',
  '/Yaqoub-and-Amani/_next/static/css/198086b735cd6789.css',
  '/Yaqoub-and-Amani/_next/static/chunks/webpack-5eb478da20315f9d.js',
  '/Yaqoub-and-Amani/_next/static/chunks/4bd1b696-c023c6e3521b1417.js',
  '/Yaqoub-and-Amani/_next/static/chunks/255-26ce8459bf4e4a9c.js',
  '/Yaqoub-and-Amani/_next/static/chunks/main-app-d3d10bdf33c5cefd.js',
  '/Yaqoub-and-Amani/_next/static/chunks/app/page-b0b309f41d0e8276.js',
  '/Yaqoub-and-Amani/_next/static/chunks/polyfills-42372ed130431b0a.js',
  '/Yaqoub-and-Amani/_next/static/chunks/framework-1570c2e8a0b531a3.js',
  '/Yaqoub-and-Amani/_next/static/chunks/main-0b847b8e198123b1.js',
  '/Yaqoub-and-Amani/canva-silhouette-couple-in-love-MADAUcd76Ck.jpg',
  '/Yaqoub-and-Amani/iges.jfif',
  '/Yaqoub-and-Amani/_next/static/media/01f0c602c274ea55-s.woff2',
  '/Yaqoub-and-Amani/_next/static/media/19cfc7226ec3afaa-s.woff2',
  '/Yaqoub-and-Amani/_next/static/media/21350d82a1f187e9-s.woff2',
  '/Yaqoub-and-Amani/_next/static/media/28a2004cf8372660-s.woff2',
  '/Yaqoub-and-Amani/_next/static/media/350b852752f8489d-s.p.woff2',
  '/Yaqoub-and-Amani/_next/static/media/47f136985ef5b5cb-s.woff2',
  '/Yaqoub-and-Amani/_next/static/media/4ead58c4dcc3f285-s.woff2',
  '/Yaqoub-and-Amani/_next/static/media/5ec84f17416dda4d-s.woff2',
  '/Yaqoub-and-Amani/_next/static/media/8e9860b6e62d6359-s.woff2',
  '/Yaqoub-and-Amani/_next/static/media/ba9851c3c22cd980-s.woff2',
  '/Yaqoub-and-Amani/_next/static/media/c5fe6dc8356a8c31-s.woff2',
  '/Yaqoub-and-Amani/_next/static/media/df0a9ae256c0569c-s.woff2',
  '/Yaqoub-and-Amani/_next/static/media/e4af272ccee01ff0-s.p.woff2',
  '/Yaqoub-and-Amani/_next/static/media/eaead17c7dbfcd5d-s.p.woff2',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache =>
      Promise.allSettled(PRECACHE.map(url =>
        cache.add(url).catch(() => {})
      ))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (e.request.url.includes('sockjs-node') || e.request.url.includes('__next')) return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE).then(cache => cache.put(e.request, clone));
        }
        return response;
      }).catch(() => {
        if (e.request.mode === 'navigate') return caches.match('/Yaqoub-and-Amani/');
        if (e.request.destination === 'document') return caches.match('/Yaqoub-and-Amani/');
        try { return new Response('', { status: 408, statusText: 'Offline' }); } catch(_) { }
      });
    })
  );
});
