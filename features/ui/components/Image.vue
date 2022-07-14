<script lang="ts" setup>
import { onMounted, ref } from 'vue';

const image = ref<HTMLImageElement>();
const isLoaded = ref(true);
const props = defineProps<{
  src: string;
  alt: string;
  width?: number;
  height?: number;
}>();

const onLoad = () => {
  isLoaded.value = true;
};

onMounted(() => {
  if (!image.value?.complete) {
    isLoaded.value = false;
  }
});
</script>

<template>
  <div grid place-items-center>
    <UiSpinner v-if="!isLoaded" col-start="1" h-full row-start="1" w-full />

    <img
      ref="image"
      :alt="props.alt"
      col-start="1"
      duration-200
      h-auto
      :height="props.height"
      :opacity="isLoaded ? 1000 : 0"
      row-start="1"
      :src="props.src"
      transition-opacity
      w-full
      :width="props.width"
      v-bind="$attrs"
      @load="onLoad"
    />
  </div>
</template>

<style lang="scss" scoped>
img.--is-loading {
  visibility: hidden;
}
</style>
