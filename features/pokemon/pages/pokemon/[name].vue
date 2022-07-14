<script setup lang="ts">
import detailLoader from '../../loaders/detailLoader';

definePageMeta({
  loader: detailLoader
});

const {
  pokemon: { isLoading: isPokemonLoading, data: pokemon, isError },
  evolutions: { isLoading: isEvolutionsLoading, data: evolutions }
} = detailLoader.load();

const { t } = useI18n();
</script>

<template>
  <div max-w="full" space-y="4" w="screen-sm">
    <template v-if="isPokemonLoading">
      <UiSurface animate-pulse h="17" />
      <UiSurface animate-pulse h="42" />
      <UiSurface animate-pulse h="26" />
      <UiSurface animate-pulse h="30" />
    </template>

    <template v-else-if="isError">
      <UiSurface>{{ t('error') }}</UiSurface>
    </template>

    <template v-else-if="pokemon">
      <UiSurface flex gap-4 justify-between lt-sm="flex-col" rounded="lg">
        <h2 capitalize font-bold text-3xl>
          {{ pokemon.id }} - {{ pokemon.name }}
        </h2>

        <span space-x="2" text="xl lt-sm:base" uppercase>
          <span
            v-for="pkmnType in pokemon.types"
            :key="pkmnType.name"
            p-2
            rounded-xl
            :style="{ backgroundColor: pkmnType.bg, color: pkmnType.color }"
          >
            {{ pkmnType.name }}
          </span>
        </span>
      </UiSurface>

      <AppContentBlock rounded="lg" :title="t('headings.stats')">
        <div flex flex-wrap gap="3" items="center">
          <PokemonSpriteViewer mx="lt-sm:auto" :pokemon="pokemon" />

          <ul gap="2" grid grid-cols="1 lg:2">
            <PokemonStatBar
              is="li"
              v-for="stat in pokemon.stats"
              :key="stat.name"
              :stat="stat"
            />
          </ul>
        </div>
      </AppContentBlock>

      <AppContentBlock rounded="lg" :title="t('headings.description')">
        {{ pokemon.description }}
      </AppContentBlock>

      <UiSurface v-if="isEvolutionsLoading" animate-pulse h="30" />
      <AppContentBlock
        v-else-if="evolutions"
        rounded="lg"
        :title="t('headings.evolution')"
      >
        <PokemonEvolutionChain :evolution-chain="evolutions" />
      </AppContentBlock>
    </template>
  </div>
</template>

<i18n lang="json">
{
  "en": {
    "headings": {
      "stats": "Stats",
      "description": "Description",
      "evolution": "Evolution Chain"
    },
    "error": "Could not get the pokémon information"
  }
}
</i18n>
