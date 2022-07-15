<script lang="ts" setup>
const { replace } = useRouter();
const route = useRoute();

onMounted(() => {
  replace(route.fullPath);
});
</script>

<template>
  <div v-if="false" />
</template>
