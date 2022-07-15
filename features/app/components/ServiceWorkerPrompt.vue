<script setup lang="ts">
const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW();

const close = async () => {
  offlineReady.value = false;
  needRefresh.value = false;
};

const { t } = useI18n();
</script>

<template>
  <UiSurface
    v-if="needRefresh"
    border="solid 2 slate-300"
    bottom-0
    fixed
    m-5
    right-0
    role="alert"
    rounded
    shadow-xl
    space-y="3"
    z-1
  >
    <div>{{ t('messages.updateNeeded') }}</div>
    <button
      border="1 current solid"
      cursor-pointer
      mr="5"
      p-3
      p-x="3"
      p-y="2"
      @click="updateServiceWorker()"
    >
      {{ t('buttonLabels.reload') }}
    </button>
    <button
      border="1 current solid"
      cursor-pointer
      p-x="3"
      p-y="2"
      @click="close"
    >
      {{ t('buttonLabels.close') }}
    </button>
  </UiSurface>
</template>

<i18n lang="json">
{
  "en": {
    "messages": {
      "updateNeeded": "New content available, click on reload button to update."
    },
    "buttonLabels": {
      "close": "Close",
      "reload": "Reload"
    }
  }
}
</i18n>
