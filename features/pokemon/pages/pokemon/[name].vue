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
    <div v-if="data">{{ data }}</div>
  </div>
</template>
