<script lang="ts" setup>
import { EvolutionChain } from '../api';

const props = defineProps<{ evolutionChain: EvolutionChain }>();
const { t } = useI18n();
</script>

<template>
  <div gap="3" grid :grid-cols="props.evolutionChain.length">
    <div v-if="!props.evolutionChain.length">
      {{ t('empty') }}
    </div>

    <div v-for="(step, index) in props.evolutionChain" :key="index">
      <AppLink
        v-for="evolution in step"
        :key="evolution.id"
        :to="`/pokemon/${evolution.name}`"
      >
        <figure flex flex-col items-center justify-center>
          <UiImage
            :alt="evolution.name"
            crossorigin="anonymous"
            :src="evolution.sprites.default"
          />
          <figcaption text-center>{{ evolution.name }}</figcaption>
        </figure>
      </AppLink>
    </div>
  </div>
</template>

<i18n lang="json">
{
  "en": {
    "empty": "This Pokémon does not have an evolution chain."
  }
}
</i18n>
