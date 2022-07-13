<script setup lang="ts">
import { RouteLocationNormalized } from 'vue-router';

const props = withDefaults(
  defineProps<{ prefetch?: boolean; to: string | RouteLocationNormalized }>(),
  {
    prefetch: false
  }
);
const queryClient = useQueryClient();

const { resolve } = useRouter();

let timeout: ReturnType<typeof setTimeout>;

const preloadData = () => {
  resolve(props.to).matched.forEach(match => {
    match.meta.loader?.preload(resolve(props.to), queryClient);
  });
};

const preloadAssets = () => {
  resolve(props.to).matched.forEach(match => {
    // @ts-ignore
    Object.values(match.components).forEach(fn => {
      // @ts-ignore
      typeof fn === 'function' && fn();
    });
  });
};

const onMouseEnter = () => {
  if (props.prefetch === false) return;

  timeout = setTimeout(() => {
    preloadData();
    preloadAssets();
  }, 250);
};

const onMouseLeave = () => {
  if (!props.prefetch) return;
  clearTimeout(timeout);
};
</script>

<template>
  <NuxtLink
    color="inherit"
    :to="props.to"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <slot />
  </NuxtLink>
</template>
