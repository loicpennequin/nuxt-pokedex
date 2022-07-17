import { createLoader } from '@/features/core/factories/loaderFactory';

export default createLoader({
  pokemon: route => ({
    key: ['pokemon.findOneByName', route.params.name as string],
    queryOptions: { staleTime: Infinity },
    ssrPrefetch: true,
    waitPreloadBeforeNavigation: true
  }),
  evolutions: (route, { pokemon }) => ({
    key: ['pokemon.findEvolutionChain', pokemon?.evolutionChainId],
    queryOptions: { enabled: !!pokemon?.evolutionChainId, staleTime: Infinity },
    ssrPrefetch: false,
    waitPreloadBeforeNavigation: false
  })
});
