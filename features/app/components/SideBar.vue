<template>
  <UiSurface
    is="nav"
    bg="white dark:dark-100"
    flex
    flex-col
    h-full
    overflow-auto
    p="0"
    p-t-2
    w="15rem"
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
      <span i-ui-arrows-right />
      <span>Hide list</span>
    </AppSideBarToggle>

    <PokemonList />
  </UiSurface>
</template>
