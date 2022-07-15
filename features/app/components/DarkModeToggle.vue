<script setup lang="ts">
const colorMode = useColorMode();

const isDarkMode = computed({
  get: () => colorMode.preference === 'dark',
  set: val => {
    document.body.classList.add('color-mode--animating');
    colorMode.preference = val ? 'dark' : 'light';

    function cleanup() {
      document.body.classList.remove('color-mode--animating');
      document.body.removeEventListener('transitionend', cleanup);
    }
    document.body.addEventListener('transitionend', cleanup);
  }
});

const { t } = useI18n();
</script>

<template>
  <UiSwitch v-model="isDarkMode" :aria-label="t('label')">
    <template #off><div fill="dark:white" i-ui-sun /></template>
    <template #on><div fill="dark:white" i-ui-moon /></template>
  </UiSwitch>
</template>

<style lang="scss">
body.color-mode--animating {
  --at-apply: 'transition-colors duration-300';
  * {
    --at-apply: 'transition-colors duration-300';
  }
}
</style>

<i18n lang="json">
{
  "en": {
    "label": "Activate dark mode"
  }
}
</i18n>
