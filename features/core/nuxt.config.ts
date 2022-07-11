import { defineNuxtConfig } from 'nuxt';
import { vueI18n } from '@intlify/vite-plugin-vue-i18n';

export default defineNuxtConfig({
  modules: ['trpc-nuxt'],
  autoImports: {
    dirs: ['vue-query']
  },
  trpc: {
    baseURL: 'http://localhost:3000',
    endpoint: '/trpc'
  },
  vite: {
    plugins: [vueI18n({ compositionOnly: true })]
  }
});
