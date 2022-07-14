import initUnocssRuntime from '@unocss/runtime';
import presetWind from '@unocss/preset-wind';
import presetAttributify from '@unocss/preset-attributify';
import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin(() => {
  if (process.client) {
    initUnocssRuntime({
      defaults: {
        // @ts-ignore
        presets: [presetWind(), presetAttributify()]
      }
    });
  }
});
