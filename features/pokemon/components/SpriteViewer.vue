<script lang="ts" setup>
import { ref } from 'vue';
import { Pokemon } from '../factories/pokemonFactory';

const props = defineProps<{ pokemon: Pokemon }>();

const { t } = useI18n();
const isToggled = ref(false);
</script>

<template>
  <div grid justify-items-center>
    <transition-group>
      <PokemonSprite
        v-if="!isToggled"
        key="default"
        :alt="props.pokemon.name"
        aspect-square
        col-start-1
        row-start-1
        :sprite="props.pokemon.sprites.default"
        w="25"
      />

      <PokemonSprite
        v-else
        key="shiny"
        :alt="t('shinyAlt', { name: props.pokemon.name })"
        aspect-square
        col-start-1
        row-start-1
        :sprite="props.pokemon.sprites.shiny"
        w="25"
      />
    </transition-group>

    <UiSwitch v-model="isToggled">
      <template #off>{{ t('labels.normal') }}</template>
      <template #on>{{ t('labels.shiny') }}</template>
    </UiSwitch>
  </div>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  --at-apply: 'transition-opacity duration-300';
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
<i18n lang="json">
{
  "en": {
    "shinyAlt": "{name} shiny",
    "labels": {
      "normal": "Normal",
      "shiny": "Shiny"
    }
  }
}
</i18n>
