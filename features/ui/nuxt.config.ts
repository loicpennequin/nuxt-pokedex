import { defineNuxtConfig } from 'nuxt';

export default defineNuxtConfig({
  extends: ['./core'],
  modules: [
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
  ]
});
