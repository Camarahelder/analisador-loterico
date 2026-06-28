const CACHE_NAME = 'analisador-loterico-v1';
const urlsToCache = [
  '/analisador-loterico/',
  '/analisador-loterico/index.html',
  '/analisador-loterico/senha.js',
  '/analisador-loterico/icon-192x192.png',
  '/analisador-loterico/icon-512x512.png',
  '/analisador-loterico/manifest.json'
];

// Instalar e guardar em cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// Ativar e limpar caches antigos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Buscar: tenta rede primeiro, cai no cache se offline
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Atualiza o cache com a versão mais recente
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
