// service worker de Weather App
// cachea los archivos principales para que funcione offline

var CACHE = 'weather-app-v1';
var ARCHIVOS_CACHE = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './icono.svg'
];

// al instalar, guardo los archivos en cache
self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (cache) {
      return cache.addAll(ARCHIVOS_CACHE);
    })
  );
  self.skipWaiting();
});

// al activar, borro caches viejos
self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (nombres) {
      return Promise.all(
        nombres.map(function (n) {
          if (n !== CACHE) {
            return caches.delete(n);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// al pedir un archivo, lo busco en cache primero
// si no esta, lo pido a la red
self.addEventListener('fetch', function (e) {
  e.respondWith(
    caches.match(e.request).then(function (respuesta) {
      if (respuesta) {
        return respuesta;
      }
      return fetch(e.request).catch(function () {
        // si no hay red ni cache, no hacemos nada
      });
    })
  );
});
