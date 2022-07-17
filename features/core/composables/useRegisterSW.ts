import type { RegisterSWOptions } from '../utils/registerSw';
import { registerSW } from '../utils/registerSw';

export type { RegisterSWOptions };

export function useRegisterSW(options: RegisterSWOptions = {}) {
  const {
    immediate = true,
    onNeedRefresh,
    onOfflineReady,
    onRegistered,
    onRegisterError
  } = options;

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

  return {
    updateServiceWorker,
    offlineReady,
    needRefresh
  };
}
