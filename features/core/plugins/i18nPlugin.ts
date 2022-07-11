import { createI18n } from 'vue-i18n';
import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin(nuxt => {
  const i18n = createI18n({
    legacy: false,
    locale: 'en',
    messages: {},
    silentFallbackWarn: false
  });
  nuxt.vueApp.use(i18n);
});
