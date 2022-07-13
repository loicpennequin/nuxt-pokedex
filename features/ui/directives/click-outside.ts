import { Directive } from 'vue';

const listeners = new WeakMap();

export const vClickOutside: Directive = {
  mounted(el, { value: cb }) {
    const listener = (e: Event) => {
      const { target } = e;

      const isInDOM = document.body.contains(target as HTMLElement);
      if (!isInDOM) return;

      if (target !== el && !el.contains(target)) {
        cb(e);
      }
    };

    listeners.set(el, listener);
    window.addEventListener('mousedown', listener);
  },

  unmounted(el) {
    const listener = listeners.get(el);
    window.removeEventListener('mousedown', listener);
    listeners.delete(el);
  }
};
