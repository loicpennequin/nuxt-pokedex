import { defineNuxtConfig } from 'nuxt';
import transformerDirective from '@unocss/transformer-directives';
import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders';
import presetIcons from '@unocss/preset-icons';
import presetWind from '@unocss/preset-wind';
import { presetAttributify } from 'unocss';
export default defineNuxtConfig({
  modules: ['@nuxtjs/color-mode', '@unocss/nuxt'],

  components: {
    dirs: [{ path: './components', prefix: 'ui' }]
  },

  colorMode: {
    preference: 'system',
    fallback: 'light',
    classPrefix: '',
    classSuffix: ''
  },

  unocss: {
    autoImport: true,

    preflight: true,
    presets: [
      presetAttributify(),
      presetWind(),
      presetIcons({
        collections: {
          ui: FileSystemIconLoader('./assets/icons', svg => {
            return svg
              .replace('<svg ', '<svg fill="currentColor" ')
              .split('style=')
              .join(' style=');
          })
        }
      }) as any
    ],
    transformers: [transformerDirective()] as any,
    safelist: ['[grid-cols~="3"]', '[grid-cols~="2"]', '[grid-cols~="1"]']
  }
});
