<script lang="ts">
export default { inheritAttrs: false };
</script>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';

const image = ref<HTMLImageElement>();
const isLoaded = ref(true);
const props = defineProps<{
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
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
  <div class="ui-image" grid place-items-center>
    <UiSpinner v-if="!isLoaded" h-full w-full />

    <img
      ref="image"
      :alt="props.alt"
      :height="props.height"
      :opacity="isLoaded ? 1000 : 0"
      :src="props.src"
      :width="props.width"
      v-bind="$attrs"
      @load="onLoad"
    />
  </div>
</template>

<style lang="scss" scoped>
.ui-image {
  > * {
    grid-column: 1;
    grid-row: 1;
  }
}

img.--is-loading {
  visibility: hidden;
}

img {
  --at-apply: 'duration-200 h-auto transition-opacity w-full';
}
</style>
