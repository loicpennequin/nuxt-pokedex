import { defineNuxtConfig } from 'nuxt';
import Icons from 'unplugin-icons/vite';
import transformerDirective from '@unocss/transformer-directives';
import IconsResolver from 'unplugin-icons/resolver';
import Components from 'unplugin-vue-components/vite';
import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders';
import presetIcons from '@unocss/preset-icons';
import presetWind from '@unocss/preset-wind';
import { presetAttributify } from 'unocss';

export default defineNuxtConfig({
  extends: ['./features/core', './features/ui'],
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
          ui: FileSystemIconLoader('./assets/icons', svg =>
            svg.replace(/#fff/, 'currentColor')
          )
        }
      })
    ]
    // transformers: [transformerDirective()]
  },
  vite: {
    plugins: [
      Components({
        resolvers: [IconsResolver()]
      }),

      Icons({
        customCollections: {
          ui: FileSystemIconLoader('./assets/icons', svg =>
            svg.replace(/^<svg /, '<svg fill="currentColor" ')
          )
        }
      })
    ]
  }
});
