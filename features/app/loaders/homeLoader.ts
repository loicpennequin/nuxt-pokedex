import { createLoader } from '@/features/core/factories/loaderFactory';

export default createLoader({
  pokemonOfTheDay: () => ({
    key: ['pokemon.findOneByName', 'pikachu'],
    queryOptions: {},
    ssrPrefetch: true,
    waitPreloadBeforeNavigation: true
  })
});
