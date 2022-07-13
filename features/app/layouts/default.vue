<script lang="ts" setup>
import { ref } from 'vue';
import { vClickOutside } from '@/features/ui/directives/click-outside';

const isSidebarOpened = ref(false);
const closeSidebar = () => {
  isSidebarOpened.value = false;
};
</script>

<template>
  <UiContainer class="layout" grid min-h-screen>
    <input
      v-model="isSidebarOpened"
      id="sidebar-toggle"
      sr-only
      type="checkbox"
    />

    <AppHeader col-span="full" sticky top="0" z-1 />

    <a href="#main" sr-only>Skip to main content</a>

    <aside
      v-click-outside="closeSidebar"
      col-start-1
      h="screen"
      lt-sm="fixed"
      top="lt-sm:0"
      transition-duration="0 lt-sm:300"
      transition-transform
      z="lt-sm:2"
    >
      <AppSideBar />
    </aside>

    <main
      col-span="1"
      col-start="2 lt-sm:1"
      :overflow-x="isSidebarOpened && 'lt-sm:hidden'"
    >
      <slot />
    </main>
  </UiContainer>
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
