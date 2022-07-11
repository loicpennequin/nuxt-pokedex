<script lang="ts" setup>
const { t } = useI18n();
</script>

<template>
  <header
    bg="white dark:dark-100"
    flex
    items="center"
    justify="between"
    p="2"
    px="sm:10"
  >
    <AppSideBarToggle
      flex
      gap="3"
      items="center"
      justify="start"
      px="3"
      title="Hide list"
      w="full"
    >
      <span i-ui-bars />
    </AppSideBarToggle>
    <h1 m="0" text="2xl">
      <NuxtLink to="/">{{ t('title') }}</NuxtLink>
    </h1>
  </header>
</template>

<i18n lang="json">
{
  "en": {
    "title": "Pokédex App"
  }
}
</i18n>
