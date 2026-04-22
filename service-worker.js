// service-worker.js — Estrategia "auto-sigilosa"
// Network-first para HTML/JSX (siempre última versión si hay red),
// Stale-while-revalidate para el resto (instantáneo pero se actualiza).
// Bypass total para Supabase / CDNs dinámicos.

const VERSION = 'execlog-v2';
const CORE_CACHE = `${VERSION}-core`;
const RUNTIME_CACHE = `${VERSION}-runtime`;

// Recursos mínimos que queremos disponibles offline
const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg',
  './icon-maskable.svg',
];

// Orígenes que NUNCA cacheamos (Supabase auth/data, fonts dinámicas opcional)
const BYPASS_HOSTS = [
  'supabase.co',
  'supabase.in',
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CORE_CACHE).then((cache) => cache.addAll(CORE_ASSETS).catch(() => {}))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k))
    );
    await self.clients.claim();
  })());
});

function isBypass(url) {
  return BYPASS_HOSTS.some((h) => url.hostname.includes(h));
}

function isHTML(req) {
  return req.mode === 'navigate' ||
    (req.headers.get('accept') || '').includes('text/html');
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Bypass total para Supabase (datos + auth en vivo)
  if (isBypass(url)) return;

  // Navegación / HTML → network-first con fallback al caché
  if (isHTML(req)) {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        const cache = await caches.open(CORE_CACHE);
        cache.put('./index.html', fresh.clone()).catch(() => {});
        return fresh;
      } catch {
        const cached = await caches.match('./index.html');
        return cached || new Response('Offline', { status: 503 });
      }
    })());
    return;
  }

  // Resto (scripts, estilos, fuentes, CDNs estáticos) → stale-while-revalidate
  event.respondWith((async () => {
    const cached = await caches.match(req);
    const fetchPromise = fetch(req).then((res) => {
      if (res && res.status === 200 && (res.type === 'basic' || res.type === 'cors')) {
        const clone = res.clone();
        caches.open(RUNTIME_CACHE).then((c) => c.put(req, clone)).catch(() => {});
      }
      return res;
    }).catch(() => null);
    return cached || (await fetchPromise) || new Response('', { status: 504 });
  })());
});

// Permite que la página fuerce la activación de una versión nueva
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
