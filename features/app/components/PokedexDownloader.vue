<script setup lang="ts">
const { t } = useI18n();

const { download, isDownloading, isDownloaded, progress } =
  usePokedexDownloader();

const label = computed(() => {
  if (isDownloading.value) {
    return t('downloading', { progress: progress.value });
  }
  if (isDownloaded.value) return t('downloaded');
  return t('download');
});
</script>

<template>
  <button
    :disabled="isDownloading"
    flex
    gap-2
    items-center
    m-l-3
    opacity="100 disabled:30"
    @click="download"
  >
    <UiSpinner v-if="isDownloading" />
    <span v-else-if="isDownloaded" bg-green-400 i-ui-check w-4 />
    <span v-else i-ui-download w-4 />

    {{ label }}
  </button>
  <div bg-slate-400 h="1" :style="{ width: `${progress}%` }" />
</template>

<i18n lang="json">
{
  "en": {
    "download": "Download Pokédex",
    "downloading": "Downloading - {progress}%",
    "downloaded": "Pokédex downloaded"
  }
}
</i18n>
