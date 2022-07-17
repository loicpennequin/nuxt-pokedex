import {
  VueQueryPlugin,
  VueQueryPluginOptions,
  QueryClient,
  hydrate,
  dehydrate
} from 'vue-query';
import { defineNuxtPlugin } from '#app';
import { get, del } from 'idb-keyval';

export default defineNuxtPlugin(nuxt => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        refetchOnWindowFocus: false,
        retry: false
      }
    }
  });
  const options: VueQueryPluginOptions = { queryClient };

  nuxt.vueApp.use(VueQueryPlugin, options);

  if (process.server) {
    nuxt.hooks.hook('app:rendered', () => {
      if (!nuxt.payload.state) nuxt.payload.state = {};
      const state = dehydrate(queryClient);

      nuxt.payload.state.vueQuery = state;
    });
  }

  if (process.client) {
    nuxt.hooks.hook('app:created', async () => {
      if (window.navigator.onLine) {
        return hydrate(queryClient, nuxt.payload.state?.vueQuery);
      }
      const persistedState = await get('dehydratedQueryClient');
      if (!persistedState) return;

      const currentVersion = nuxt.$config.public.version;
      const versionMismatch = persistedState?.version !== currentVersion;
      if (versionMismatch) {
        del('dehydratedQueryClient');
      }

      hydrate(queryClient, persistedState.state);
    });
  }
});
