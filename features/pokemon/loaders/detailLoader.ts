import { createLoader } from '@/features/core/factories/loaderFactory';

export default createLoader({
  pokemon: {
    key: route => ['pokemon.findOneByName', route.params.name as string],
    queryOptions: {},
    ssrPrefetch: true,
    waitPreloadBeforeNavigation: true
  },
  evolutions: {
    key: (route, { pokemon }) => {
      return (
        pokemon && ['pokemon.findEvolutionChain', pokemon.evolutionChainId]
      );
    },
    ssrPrefetch: true,
    queryOptions: {}
  }
});
