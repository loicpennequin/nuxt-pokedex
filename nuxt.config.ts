import { defineNuxtConfig } from 'nuxt';
import pkgJson from './package.json';

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
  },
  runtimeConfig: {
    public: {
      version: pkgJson.version
    }
  }
});
