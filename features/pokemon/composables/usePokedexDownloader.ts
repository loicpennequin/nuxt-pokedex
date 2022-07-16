import { chunk } from 'lodash-es';
import { TOTAL_POKEMON_COUNT } from '../constants';
import { set } from 'idb-keyval';
import { Pokemon } from '../factories/pokemonFactory';
import {
  PathAndInput,
  TrpcQueryPath
} from '~~/features/core/composables/useTrpcQuery';
import { dehydrate } from 'vue-query';

type Chunk = { name: string }[];

const CHUNK_SIZE = 25;

export const usePokedexDownloader = () => {
  const isDownloaded = ref<boolean>(false);
  const client = useClient();
  const queryClient = useQueryClient();

  const { data: pokemons } = useTrpcQuery(
    ['pokemon.findAll', { limit: TOTAL_POKEMON_COUNT, offset: 0 }],
    {
      staleTime: Infinity
    }
  );

  const isDownloading = ref(false);
  const downloadCount = ref(0);

  const processChunk = async (chunk: Chunk) => {
    const promises = chunk.map(async ({ name }) => {
      const pokemon = await fetchPokédexEntry(name);
      await cacheSprites(pokemon);
    });

    const results = await Promise.all(promises);
    downloadCount.value += results.length;
  };

  const fetchPokédexEntry = async (name: string) => {
    const pokemon = await prefetchQuery(['pokemon.findOneByName', name]);

    if (pokemon.evolutionChainId) {
      await prefetchQuery([
        'pokemon.findEvolutionChain',
        pokemon.evolutionChainId
      ]);
    }

    return pokemon;
  };

  const prefetchQuery = async <T extends TrpcQueryPath>(
    pathAndInput: PathAndInput<T>
  ) => {
    const result = await client.query(...pathAndInput);
    queryClient.setQueryData(pathAndInput, result);

    return result;
  };

  const cacheSprites = (pokemon: Pokemon) =>
    Promise.all(
      Object.values(pokemon.sprites)
        .filter(Boolean)
        .map(
          url =>
            new Promise<void>(resolve => {
              const img = new Image();
              img.src = url;
              img.crossOrigin = 'anonymous';
              img.style.display = 'none';
              document.body.appendChild(img);
              img.addEventListener('load', () => {
                img.remove();
                resolve();
              });
            })
        )
    );

  return {
    isDownloading: readonly(isDownloading),
    isDownloaded: readonly(isDownloaded),
    progress: computed(() =>
      Math.round((downloadCount.value / TOTAL_POKEMON_COUNT) * 100)
    ),
    async download() {
      if (isDownloaded.value) return;
      isDownloading.value = true;

      const chunks = chunk(pokemons.value?.results, CHUNK_SIZE);
      for (const chunk of chunks) {
        await processChunk(chunk);
      }

      set('dehydratedQueryClient', dehydrate(queryClient));
      isDownloading.value = false;
      isDownloaded.value = true;
    }
  };
};
