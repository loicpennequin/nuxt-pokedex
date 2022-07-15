importScripts('<%= options.workboxUrl %>');

const { registerRoute, NavigationRoute } = workbox.routing;
const { NetworkFirst, StaleWhileRevalidate, CacheFirst } = workbox.strategies;
const { CacheableResponsePlugin } = workbox.cacheableResponse;
const { ExpirationPlugin } = workbox.expiration;
const { setCacheNameDetails, cacheNames } = workbox.core;

const { precacheAndRoute, cleanupOutdatedCaches, getCacheKeyForURL } =
  workbox.precaching;

const isDev = '<%= options.dev %>' === 'true';

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

setCacheNameDetails({
  prefix: 'vite-pokedex',
  suffix: 'v1',
  precache: 'precache',
  runtime: 'runtime'
});

precacheAndRoute([{ url: '/offline-shell', revision: new Date().toString() }]);
cleanupOutdatedCaches();

const htmlHandler = new NetworkFirst({
  cacheName: 'nuxt-pokedex-pages-v1',
  plugins: [
    new CacheableResponsePlugin({ statuses: [200] }),
    {
      async cacheKeyWillBeUsed({ request, mode }) {
        const url = new URL(request.url, 'http://localhost:3000');
        url.searchParams.set('sw', true);
        return url.toString();
      }
    }
  ]
});
registerRoute(
  new NavigationRoute(async options => {
    try {
      const response = await htmlHandler.handle(options);
      if (!response) throw new Error('NetworkFirst fail');

      return response;
    } catch (err) {
      const cache = await caches.open(cacheNames.precache);
      const cacheKey = getCacheKeyForURL('/offline-shell');
      if (!cacheKey) throw new Error(`Non-precached-url: /offline-shell`);

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
  const url = new URL(event.data.url, 'http://localhost:3000');
  url.searchParams.set('sw', true);
  cache.add(url.toString());
};

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
