<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

const props = defineProps<{ alt: string; sprite: string }>();

const { t } = useI18n();
</script>

<template>
  <div>
    <UiImage v-if="props.sprite" :alt="props.alt" :src="props.sprite" />
    <p v-else m-x="auto" text="sm" text-center>
      {{ t('unavailable') }}
    </p>
  </div>
</template>

<i18n lang="json">
{ "en": { "unavailable": "Sprite not available" } }
</i18n>
