import { createLoader } from '@/features/core/factories/loaderFactory';
import { TOTAL_POKEMON_COUNT } from '~~/features/pokemon/constants';

export default createLoader({
  pokemonOfTheDay: () => {
    const seed = useState<string>('pokemonOfTheDay', () =>
      Math.round(Math.random() * TOTAL_POKEMON_COUNT).toString()
    );
    return {
      key: ['pokemon.findOneByName', seed.value],
      queryOptions: {},
      ssrPrefetch: true,
      waitPreloadBeforeNavigation: true
    };
  }
});
