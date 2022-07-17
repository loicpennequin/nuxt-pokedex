import { chunk } from 'lodash-es';
import { TOTAL_POKEMON_COUNT } from '../constants';
import { get, set } from 'idb-keyval';
import { Pokemon } from '../factories/pokemonFactory';
import {
  PathAndInput,
  TrpcQueryPath
} from '~~/features/core/composables/useTrpcQuery';
import { dehydrate } from 'vue-query';

type Chunk = { name: string }[];

const CHUNK_SIZE = 10;
const IDB_KEY = 'dehydratedQueryClient';

export const usePokedexDownloader = () => {
  const client = useClient();
  const queryClient = useQueryClient();
  const config = useRuntimeConfig();

  const isDownloaded = ref<boolean>(false);
  onMounted(async () => {
    const persistedState = await get(IDB_KEY);
    console.log(persistedState);
    if (!persistedState) return;
    const currentVersion = config.public.version;
    if (currentVersion !== persistedState.version) return;
    isDownloaded.value = true;
  });

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
      try {
        const pokemon = await fetchPokédexEntry(name);
        await prefetchSprites(pokemon);
      } catch (err) {
        console.error(err);
      }
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

  const prefetchSprites = (pokemon: Pokemon) =>
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
              img.addEventListener('error', () => {
                console.error('error caching sprite', url);
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
      const persistedState = {
        version: config.public.version,
        state: JSON.parse(JSON.stringify(dehydrate(queryClient))) // using the dehydrated state causes indexeddb errors
      };
      set(IDB_KEY, persistedState);
      isDownloading.value = false;
      isDownloaded.value = true;
    }
  };
};
