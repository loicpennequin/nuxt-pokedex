import { defineNuxtConfig } from 'nuxt';

export default defineNuxtConfig({
  modules: ['trpc-nuxt'],
  autoImports: {
    dirs: ['vue-query']
  },
  trpc: {
    baseURL: 'http://localhost:3000',
    endpoint: '/trpc'
  }
});
