import * as workboxWindow from 'workbox-window';
const { Workbox, messageSW } = workboxWindow;

export interface RegisterSWOptions {
  immediate?: boolean;
  onNeedRefresh?: () => void;
  onOfflineReady?: () => void;
  onRegistered?: (registration: ServiceWorkerRegistration | undefined) => void;
  onRegisterError?: (error: any) => void;
}

const auto = false;

export function registerSW(options: RegisterSWOptions = {}) {
  const {
    immediate = false,
    onNeedRefresh,
    onOfflineReady,
    onRegistered,
    onRegisterError
  } = options;

  let wb: any;
  let registration: ServiceWorkerRegistration | undefined;

  const updateServiceWorker = async (reloadPage = true) => {
    if (reloadPage) {
      wb?.addEventListener('controlling', (event: any) => {
        if (event.isUpdate) window.location.reload();
      });
    }

    if (registration && registration.waiting) {
      await messageSW(registration.waiting, { type: 'SKIP_WAITING' });
    }
  };

  if ('serviceWorker' in navigator) {
    // __SW__, __SCOPE__ and __TYPE__ will be replaced by virtual module
    wb = new Workbox('/sw.js', { scope: '/' });

    wb.addEventListener('activated', () => {
      console.log('on offline ready');
      onOfflineReady?.();
    });

    const showSkipWaitingPrompt = () => {
      console.log('need refresh');
      onNeedRefresh?.();
    };

    wb.addEventListener('waiting', showSkipWaitingPrompt);
    wb.addEventListener('externalwaiting', showSkipWaitingPrompt);

    // register the service worker
    wb.register({ immediate })
      .then((r: any) => {
        registration = r;
        console.log('on register');
        onRegistered?.(r);
      })
      .catch((e: any) => {
        onRegisterError?.(e);
      });
  }

  return updateServiceWorker;
}
