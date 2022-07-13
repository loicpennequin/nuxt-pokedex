import { createLoader } from '@/features/core/factories/loaderFactory';

export default createLoader({
  pokemon: {
    key: route => ['pokemon.findOneByName', route.params.name as string],
    queryOptions: {},
    ssrPrefetch: true,
    waitPreloadBeforeNavigation: true
  }
});
