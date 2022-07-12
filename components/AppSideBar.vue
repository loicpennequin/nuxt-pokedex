<template>
  <nav flex flex-col h-full min-w="15rem" overflow-auto>
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
  </nav>
</template>
