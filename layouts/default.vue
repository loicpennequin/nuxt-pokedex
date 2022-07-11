<script lang="ts" setup>
import { ref } from 'vue';

const isSidebarOpened = ref(false);
</script>

<template>
  <div class="layout" grid min-h-screen min-w-screen>
    <input
      v-model="isSidebarOpened"
      id="sidebar-toggle"
      sr-only
      type="checkbox"
    />

    <header
      bg-red-100
      col-span="full"
      flex
      gap-3
      items-center
      sticky
      top="0"
      z-1
    >
      <label for="sidebar-toggle"><h1>Pokedex App</h1></label>
    </header>

    <a href="#main" sr-only>Skip to main content</a>

    <aside
      bg-red-100
      class="layout__sidebar"
      col-start-1
      h="lt-sm:screen"
      lt-sm="fixed"
      min-w-15rem
      top="lt-sm:0"
      transition-duration="0 lt-sm:300"
      transition-transform
      z="lt-sm:2"
    >
      <label for="sidebar-toggle">Sidebar</label>
    </aside>

    <main
      col-span="1"
      col-start="2 lt-sm:1"
      :overflow-x="isSidebarOpened && 'lt-sm:hidden'"
    >
      <slot />
    </main>
  </div>
</template>

<style scoped lang="scss">
.layout {
  grid-template-columns: auto minmax(0, 1fr);
  grid-template-rows: 56px 1fr;

  @media screen and (max-width: 640px) {
    grid-template-columns: minmax(0, 1fr);
  }

  > aside {
    @media screen and (min-width: 640px) {
      height: calc(100vh - 56px);
    }
  }
}

#sidebar-toggle {
  @media screen and (max-width: 640px) {
    &:not(:checked) ~ aside {
      transform: translateX(-100%);
    }

    &:checked ~ aside {
      transform: none;
    }
  }
}
</style>
