import { defineNuxtConfig } from 'nuxt';

export default defineNuxtConfig({
  extends: [
    './features/app',
    './features/core',
    './features/ui',
    './features/pokemon'
  ],
  modules: ['@unocss/nuxt'],
  typescript: {
    strict: true
  }
});
