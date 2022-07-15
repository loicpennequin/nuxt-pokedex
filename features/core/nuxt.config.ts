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
    manifest: {
      name: 'Nuxt Pokedex',
      short_name: 'Nuxt Pokedex'
    },
    workbox: {
      enabled: true,
      swTemplatePath: resolve(process.cwd(), 'features/core/templates/sw.js'),
      autoRegister: false
    }
  },
  vite: {
    plugins: [vueI18n({ compositionOnly: true })]
  }
});
