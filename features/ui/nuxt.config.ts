import { defineNuxtConfig } from 'nuxt';

export default defineNuxtConfig({
  modules: ['trpc-nuxt'],

  components: {
    dirs: [{ path: './components', prefix: 'ui' }]
  }
});
