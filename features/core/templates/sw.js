importScripts('<%= options.workboxUrl %>');

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());

const { registerRoute, NavigationRoute } = workbox.routing;
const { NetworkFirst, StaleWhileRevalidate, CacheFirst } = workbox.strategies;
const { CacheableResponsePlugin } = workbox.cacheableResponse;
const { ExpirationPlugin } = workbox.expiration;
const { setCacheNameDetails, cacheNames } = workbox.core;

const { precacheAndRoute, cleanupOutdatedCaches, getCacheKeyForURL } =
  workbox.precaching;

setCacheNameDetails({
  prefix: 'vite-pokedex',
  suffix: 'v1',
  precache: 'precache',
  runtime: 'runtime'
});

precacheAndRoute([{ url: '/offline-shell', revision: new Date().toString() }]);
cleanupOutdatedCaches();

// Cache page navigations (html) with a Network First strategy, when offline fallback to offline shell
// registerRoute(
//   ({ request }) => {
//     return request.mode === 'navigate';
//   },
//   new NetworkFirst({
//     cacheName: 'nuxt-pokedex-pages-v1',
//     plugins: [new CacheableResponsePlugin({ statuses: [200] })]
//   })
// );

const htmlHandler = new NetworkFirst({ cacheName: 'nuxt-pokedex-pages-v1' });
registerRoute(
  new NavigationRoute(async options => {
    console.log('hello ?');
    try {
      const response = await htmlHandler.handle(options);
      if (!response) throw new Error('NetworkFirst fail');

      return response;
    } catch (err) {
      const cache = await caches.open(cacheNames.precache);
      const cacheKey = getCacheKeyForURL('/offline-shell');
      if (!cacheKey) throw new Error(`Non-precached-url: ${'/offline-shell'}`);

      const fallbackResponse = await cache.match(cacheKey);
      if (fallbackResponse) {
        return fallbackResponse;
      }

      throw err;
    }
  })
);
const htmlRuntimeCache = new BroadcastChannel('sw-loader-channel');
htmlRuntimeCache.onmessage = async event => {
  if (event.type !== 'message') return;
  if (event.data.type !== 'NAVIGATE') return;

  const cache = await caches.open('nuxt-pokedex-pages-v1');
  cache.add(event.data.url);
};

const isDev = '<%= options.dev %>' === 'true';

if (!isDev) {
  // Cache CSS, JS, and Web Worker requests with a Stale While Revalidate strategy
  registerRoute(
    ({ request }) =>
      request.destination === 'style' ||
      request.destination === 'script' ||
      request.destination === 'worker',
    new StaleWhileRevalidate({
      cacheName: 'nuxt-pokedex-assets-v1',
      plugins: [new CacheableResponsePlugin({ statuses: [200] })]
    })
  );
}

registerRoute(
  /^https:\/\/.+\.(png|jpg|svg)$/i,
  new CacheFirst({
    cacheName: 'nuxt-pokedex-images-v1',
    plugins: [
      new ExpirationPlugin({
        // Only cache  for a week
        maxAgeSeconds: 7 * 24 * 60 * 60, // 1 week
        maxEntries: 200
      }),
      new CacheableResponsePlugin({
        statuses: [0, 200]
      })
    ]
  })
);

// Cache api request using network first, this is possible because all api data is static
registerRoute(
  /\/trpc\//i,
  new NetworkFirst({
    cacheName: 'nuxt-pokedex-api-v1',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200]
      })
    ]
  })
);
