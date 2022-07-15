import type { RegisterSWOptions } from '../utils/registerSw';
import { registerSW } from '../utils/registerSw';
import { useBroadcastChannel } from '@vueuse/core';

export type { RegisterSWOptions };

export function useRegisterSW(options: RegisterSWOptions = {}) {
  const {
    immediate = true,
    onNeedRefresh,
    onOfflineReady,
    onRegistered,
    onRegisterError
  } = options;

  const { isSupported, post } = useBroadcastChannel({
    name: 'sw-loader-channel'
  });

  const needRefresh = ref(false);
  const offlineReady = ref(false);

  const updateServiceWorker = registerSW({
    immediate,
    onNeedRefresh() {
      needRefresh.value = true;
      onNeedRefresh?.();
    },
    onOfflineReady() {
      offlineReady.value = true;
      onOfflineReady?.();
    },
    onRegistered,
    onRegisterError
  });

  const router = useRouter();
  router.afterEach(to => {
    if (isSupported) {
      post({
        type: 'NAVIGATE',
        url: to.fullPath
      });
    }
  });

  return {
    updateServiceWorker,
    offlineReady,
    needRefresh
  };
}
