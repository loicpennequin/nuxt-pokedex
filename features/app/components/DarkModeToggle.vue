<script setup lang="ts">
const colorMode = useColorMode();

const isDarkMode = computed({
  get: () => colorMode.preference === 'dark',
  set: val => (colorMode.preference = val ? 'dark' : 'light')
});
</script>

<template>
  <UiSwitch v-model="isDarkMode">
    <template #off><div fill="dark:white" i-ui-sun /></template>
    <template #on><div fill="dark:white" i-ui-moon /></template>
  </UiSwitch>
</template>
