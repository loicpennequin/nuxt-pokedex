<script setup lang="ts">
import { RecycleScroller } from 'vue-virtual-scroller';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';

const emit = defineEmits<{
  (e: 'item-click'): void;
}>();

const { t } = useI18n();
const route = useRoute();
const SSR_RESULT_PER_PAGE = 35;
const ITEM_HEIGHT = 32;
const page = computed(() => Number(route.query.sidebar_page ?? 1));
const offset = computed(() =>
  import.meta.env.SSR ? (page.value - 1) * SSR_RESULT_PER_PAGE : 0
);
const limit = computed(() => (import.meta.env.SSR ? SSR_RESULT_PER_PAGE : 905));

const { data: pokemons, suspense } = useTrpcQuery(
  ['pokemon.findAll', { limit: 905, offset: 0 }],
  {
    staleTime: 0
  }
);
const queryClient = useQueryClient();
onServerPrefetch(async () => {
  await suspense();
  // We went to limit the amount of result serialized in the HTML during SSR
  // if we use the itrpc query input, it will change the query key and trigger a hard loading state client sidebar_page
  // let's avoid that
  queryClient.setQueryData(['pokemon.findAll', { limit: 905, offset: 0 }], {
    ...pokemons.value,
    results: pokemons.value?.results.slice(
      offset.value,
      offset.value + limit.value
    )
  });
});

const search = ref('');

const filteredPokemons = computed(() =>
  pokemons.value?.results.filter((pokemon: any) =>
    pokemon.name.includes(search.value.toLocaleLowerCase())
  )
);

const virtualScrollRoot = ref<any>();
onMounted(() => {
  if (page.value <= 1) return;
  setTimeout(() => {
    virtualScrollRoot.value.$el.scrollTop =
      (page.value - 1) * SSR_RESULT_PER_PAGE * ITEM_HEIGHT;
  });
});
</script>

<template>
  <UiSurface p="2" sticky top="0" z-1>
    <input
      v-model="search"
      :aria-label="t('searchLabel')"
      bg="white dark:dark-300"
      border="1 solid slate-400 dark:slate-600"
      p="2"
      :placeholder="t('searchLabel')"
    />
  </UiSurface>

  <RecycleScroller
    v-if="pokemons"
    ref="virtualScrollRoot"
    v-slot="{ item: pokemon }"
    h-full
    :item-size="ITEM_HEIGHT"
    :items="filteredPokemons"
    key-field="name"
    :prerender="SSR_RESULT_PER_PAGE"
  >
    <AppLink
      block
      capitalize
      h="32px"
      p-x="3"
      prefetch
      space-x="1"
      :to="`/pokemon/${pokemon.name}`"
      @click="emit('item-click')"
    >
      {{ pokemon.name }}
    </AppLink>
  </RecycleScroller>

  <div v-if="!virtualScrollRoot" flex justify-between p="2" underline>
    <router-link v-if="page > 1" :to="{ query: { sidebar_page: page - 1 } }">
      Previous
    </router-link>
    <router-link :to="{ query: { sidebar_page: page + 1 } }">Next</router-link>
  </div>
</template>

<style scoped>
.router-link-exact-active {
  --at-apply: 'bg-light-300 dark:bg-dark-200';
}
</style>

<i18n lang="json">
{
  "en": {
    "searchLabel": "Search for a Pokémon"
  }
}
</i18n>
