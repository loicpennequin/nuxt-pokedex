<script lang="ts" setup>
import { ref, computed } from 'vue';
import { vUid } from '../directives/unique-id';

const props = defineProps<{ modelValue: boolean; ariaLabel: string }>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const vModel = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit('update:modelValue', val);
  }
});

const inputEl = ref<HTMLInputElement>();
</script>

<template>
  <div
    flex
    gap-xs
    items-center
    outline="4 solid transparent focus-within:slate-300"
    p="1"
    rounded="full"
    text-xs
  >
    <input
      v-model="vModel"
      ref="inputEl"
      v-uid
      :aria-label="props.ariaLabel"
      sr-only
      type="checkbox"
    />
    <slot name="off" />
    <label
      border="solid 1 gray-400 dark:gray-500"
      cursor-pointer
      :for="inputEl?.id"
      h="5"
      p-x="1"
      relative
      rounded-full
      un-after="absolute top-0  w-4 h-4 rounded-full bg-slate-600 dark:bg-slate-300 duration-200"
      w="10"
    />
    <slot name="on" />
  </div>
</template>

<style lang="scss" scoped>
label::after {
  content: '';
  margin-top: 1px;
  margin-left: 1px;
}

input[type='checkbox'] {
  &:not(:checked) {
    ~ label::after {
      left: 0;
    }
  }

  &:checked {
    ~ label::after {
      left: calc(100% - 18px);
    }
  }
}
</style>
