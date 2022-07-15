<script lang="ts" setup>
import { useOnline } from '@vueuse/core';

const isOnline = useOnline();
const isDisplayed = ref(!isOnline.value);

watchEffect(() => {
  setTimeout(
    () => {
      isDisplayed.value = !isOnline.value;
    },
    isOnline.value ? 3000 : 0
  );
});

const { t } = useI18n();
</script>

<template>
  <transition appear>
    <UiSurface
      v-if="isDisplayed"
      :bg="isOnline ? 'green-300' : 'red-300'"
      bottom-0
      fixed
      flex
      gap="3"
      items-center
      left="lt-sm:0"
      m="5 lt-sm:0"
      right-0
      role="alert"
      rounded
      shadow-xl
      z-1
    >
      <div
        aspect-square
        :class="isOnline ? 'i-ui-online' : 'i-ui-offline'"
        w-5
      />
      {{ t(isOnline ? 'online' : 'offline') }}
      <button i-ui-close :title="t('close')" @click="isDisplayed = false" />
    </UiSurface>
  </transition>
</template>

<style>
.v-enter-active,
.v-leave-active {
  --at-apply: 'transition-all duration-300';
}
.v-enter-from,
.v-leave-to {
  --at-apply: 'opacity-0 translate-x-full';
}
</style>

<i18n lang="json">
{
  "en": {
    "online": "You are now online",
    "offline": "You are offline",
    "close": "Close alert"
  }
}
</i18n>
