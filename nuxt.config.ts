import { defineNuxtConfig } from 'nuxt';

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  extends: ['./features/core', '/features/ui'],
  modules: [
    'trpc-nuxt',
    [
      '@unocss/nuxt',
      {
        autoImport: true,
        attributify: true,
        webFonts: false,
        wind: true,
        preflight: true
      }
    ]
  ],
  trpc: {
    baseURL: 'http://localhost:3000',
    endpoint: '/trpc'
  },
  typescript: {
    strict: true
  }
});
