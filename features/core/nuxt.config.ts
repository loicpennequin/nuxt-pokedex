import { defineNuxtConfig } from 'nuxt';
import { vueI18n } from '@intlify/vite-plugin-vue-i18n';
import { resolve } from 'path';

export default defineNuxtConfig({
  modules: ['trpc-nuxt', '@dariajs/nuxt-pwa'],
  trpc: {
    baseURL: 'http://localhost:3000',
    endpoint: '/trpc'
  },
  pwa: {
    workbox: {
      // enabled: process.env.NODE_ENV === 'production',
      enabled: true,
      swTemplatePath: resolve(process.cwd(), 'features/core/templates/sw.js'),
      autoRegister: false
    }
  },
  vite: {
    plugins: [vueI18n({ compositionOnly: true })]
  }
});
