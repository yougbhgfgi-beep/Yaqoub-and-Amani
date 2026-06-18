const CACHE = 'yaqoub-amani-v4';
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
  '/Yaqoub-and-Amani/WhatsApp Audio 2026-06-17 at 8.59.10 PM.mp4',
  '/Yaqoub-and-Amani/WhatsApp Video 2026-06-17 at 8.09.59 PM.mp4',
];

const MEDIA_RE = /\.(mp4|mp3|ogg|webm|wav|aac)(\?.*)?$/i;

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

function parseRange(rangeHeader, total) {
  const m = rangeHeader.match(/bytes=(\d+)-(\d*)/);
  if (!m) return null;
  const start = parseInt(m[1], 10);
  const end = m[2] ? parseInt(m[2], 10) : total - 1;
  if (start >= total || end >= total) return null;
  return { start, end };
}

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.hostname === 'localhost' || url.pathname.includes('sockjs-node')) return;

  if (MEDIA_RE.test(url.pathname)) {
    e.respondWith(handleMedia(e.request));
    return;
  }

  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then(cache => cache.put(e.request, clone));
        }
        return res;
      }).catch(() => {
        if (e.request.mode === 'navigate') return caches.match('/Yaqoub-and-Amani/');
        return caches.match('/Yaqoub-and-Amani/');
      });
    })
  );
});

async function handleMedia(request) {
  const range = request.headers.get('range');
  const noRange = new Request(request.url);

  const cached = await caches.match(noRange);
  if (cached) {
    if (range) return sliceResponse(cached, range);
    return cached;
  }

  try {
    const res = await fetch(noRange);
    if (!res.ok) return res;
    const cache = await caches.open(CACHE);
    cache.put(noRange, res.clone());
    if (range) return sliceResponse(res, range);
    return res;
  } catch {
    return new Response('', { status: 503, statusText: 'Offline' });
  }
}

async function sliceResponse(full, rangeHeader) {
  const buf = await full.arrayBuffer();
  const total = buf.byteLength;
  const p = parseRange(rangeHeader, total);
  if (!p) return full;
  const chunk = buf.slice(p.start, p.end + 1);
  const h = new Headers();
  h.set('Content-Type', full.headers.get('Content-Type') || 'application/octet-stream');
  h.set('Content-Length', chunk.byteLength);
  h.set('Content-Range', `bytes ${p.start}-${p.end}/${total}`);
  h.set('Accept-Ranges', 'bytes');
  if (full.headers.has('Last-Modified')) h.set('Last-Modified', full.headers.get('Last-Modified'));
  if (full.headers.has('ETag')) h.set('ETag', full.headers.get('ETag'));
  return new Response(chunk, { status: 206, statusText: 'Partial Content', headers: h });
}
