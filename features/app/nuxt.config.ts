import { defineNuxtConfig } from 'nuxt';

export default defineNuxtConfig({
  components: {
    dirs: [{ path: './components', prefix: 'app' }]
  }
});
