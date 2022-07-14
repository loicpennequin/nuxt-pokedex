<script setup lang="ts">
const router = useRouter();
const queryClient = useQueryClient();
const isPreloading = ref(false);
router.beforeEach(async (to, from, next) => {
  if (!from.name) return next();
  isPreloading.value = true;

  await Promise.all(
    to.matched.map(match => match.meta.loader?.preload(to, queryClient))
  );

  next();
  isPreloading.value = false;
});
</script>
<template>
  <NuxtLayout>
    <UiSpinner v-if="isPreloading" fixed right="5" top="8" z-10 />
    <NuxtPage page-key="static" />
  </NuxtLayout>
</template>

<style lang="scss">
* {
  /* Firefox */
  scrollbar-color: #666;
  scrollbar-width: 12px;
  /* Chrome */
  ::-webkit-scrollbar {
    --at-apply: 'bg-slate-300 dark-bg-slate-600';
    width: 10px;
    height: 10px;
    border-radius: 4px;
    overflow-x: hidden;
  }

  ::-webkit-scrollbar-thumb {
    --at-apply: 'bg-slate-600 dark-bg-slate-300';
    border-radius: 10px;
  }
}

#__nuxt {
  --at-apply: 'bg-light-400 dark:bg-dark-300 color-black dark:color-white font-sans';
}
</style>
