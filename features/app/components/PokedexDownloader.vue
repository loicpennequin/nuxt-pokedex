<script setup lang="ts">
const { t } = useI18n();

const { download, isDownloading, isDownloaded, progress } =
  usePokedexDownloader();

const percentage = computed(() => `${progress.value}%`);

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
    @click="download"
  >
    <UiSpinner v-if="isDownloading" />
    <span v-else-if="isDownloaded" bg-green-400 i-ui-check w-4 />
    <span v-else i-ui-download w-4 />

    {{ label }}
  </button>
  <div
    v-show="!isDownloaded"
    bg-slate-400
    class="progress-bar"
    duration-200
    h="1"
    transition-transform
  />
</template>

<style scoped>
.progress-bar {
  transform: scaleX(v-bind(percentage));
}
</style>
<i18n lang="json">
{
  "en": {
    "download": "Download Pokédex",
    "downloading": "Downloading - {progress}%",
    "downloaded": "Pokédex downloaded"
  }
}
</i18n>
