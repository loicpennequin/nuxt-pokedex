<script lang="ts" setup>
const { t } = useI18n();
</script>

<template>
  <header bg="white dark:dark-100" flex items="center" justify="between" p-2>
    <AppSideBarToggle
      flex
      gap="3"
      items="center"
      justify="start"
      px="3"
      :title="t('toggleLabel')"
    >
      <div h-7 i-ui-bars w-7 />
    </AppSideBarToggle>
    <h1 m="0" text="2xl">
      <NuxtLink to="/">{{ t('title') }}</NuxtLink>
    </h1>
    <AppDarkModeToggle />
  </header>
</template>

<i18n lang="json">
{
  "en": {
    "title": "Pokédex",
    "toggleLabel": "Hide List"
  }
}
</i18n>
