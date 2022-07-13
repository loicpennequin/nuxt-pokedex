<script setup lang="ts">
import detailLoader from '../../loaders/detailLoader';

definePageMeta({
  loader: detailLoader
});

const { pokemon } = detailLoader.load();
const { data, isLoading } = pokemon;
</script>

<template>
  <div>
    <div v-if="isLoading">Loading...</div>
    <h2 v-if="data">{{ data?.name }}</h2>
  </div>
</template>
