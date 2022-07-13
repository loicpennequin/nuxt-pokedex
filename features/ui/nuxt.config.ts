import { defineNuxtConfig } from 'nuxt';

export default defineNuxtConfig({
  modules: ['@nuxtjs/color-mode'],

  components: {
    dirs: [{ path: './components', prefix: 'ui' }]
  },

  colorMode: {
    preference: 'system', // default value of $colorMode.preference
    fallback: 'light', // fallback value if not system preference found
    classPrefix: '',
    classSuffix: ''
  }
});
