<script setup lang="ts">
defineProps<{ isOpened: boolean }>();
const emit = defineEmits<{
  (e: 'update:isOpened', value: boolean): void;
}>();

const onItemClick = () => {
  emit('update:isOpened', false);
};
</script>

<template>
  <UiSurface
    is="nav"
    bg=" white dark:dark-100"
    flex
    flex-col
    h-full
    overflow-auto
    p="0"
    p-t-2
    w="20rem sm:15rem"
  >
    <AppSideBarToggle aria-label="Hide list" h-6 i-ui-close px="3" self-end />
    <AppPokedexDownloader />
    <PokemonList @item-click="onItemClick" />
  </UiSurface>
</template>
