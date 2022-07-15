import { defineNuxtConfig } from 'nuxt';
import transformerDirective from '@unocss/transformer-directives';
import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders';
import presetIcons from '@unocss/preset-icons';
import presetWind from '@unocss/preset-wind';
import { presetAttributify } from 'unocss';

export default defineNuxtConfig({
  extends: [
    './features/app',
    './features/core',
    './features/ui',
    './features/pokemon'
  ],
  modules: ['trpc-nuxt', '@unocss/nuxt'],
  trpc: {
    baseURL: 'http://localhost:3000',
    endpoint: '/trpc'
  },
  typescript: {
    strict: true
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
