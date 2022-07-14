<script setup lang="ts">
const props = defineProps<{ title?: string }>();
</script>

<template>
  <UiSurface>
    <h3 v-if="title" font-bold text="2xl">{{ props.title }}</h3>

    <slot />
  </UiSurface>
</template>
