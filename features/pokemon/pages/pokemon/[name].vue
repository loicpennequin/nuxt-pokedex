<script setup lang="ts">
import detailLoader from '../../loaders/detailLoader';

definePageMeta({
  loader: detailLoader
});

const { pokemon, evolutions } = detailLoader.load();
const { data: pokemonData, isLoading: isPokemonLoading } = pokemon;
const { data: evolutionsData, isLoading: isEvolutionsLoading } = evolutions;
</script>

<template>
  <div>
    <div bg-red-100 m-b-5>
      <div v-if="isPokemonLoading">Loading pokemon...</div>
      <div v-if="pokemonData">{{ pokemonData }}</div>
    </div>

    <div m-b-5>
      <div v-if="isEvolutionsLoading">Loading evolutions...</div>
      <div v-if="evolutionsData">{{ evolutionsData }}</div>
    </div>
  </div>
</template>
