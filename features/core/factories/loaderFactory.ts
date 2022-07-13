import { QueryClient, UseQueryOptions } from 'vue-query';
import { RouteLocationNormalized } from 'vue-router';
import { PathAndInput, TrpcQueryPath } from '../composables/useTrpcQuery';

type TrpcLoaderFunction<T extends TrpcQueryPath> = (
  route: RouteLocationNormalized
) => PathAndInput<T> | null;

type TrpcKeyDictionary = Record<string, TrpcQueryPath>;

type LoaderConfig<T extends TrpcKeyDictionary> = {
  [Property in keyof T]: {
    key: TrpcLoaderFunction<T[Property]>;
    queryOptions: UseQueryOptions;
    ssrPrefetch?: boolean;
    waitPreloadBeforeNavigation?: boolean;
  };
};

type UseTrpcQueryRecord<T extends TrpcKeyDictionary> = {
  [Property in keyof T]: ReturnType<typeof useTrpcQuery<T[Property]>>;
};

export const createLoader = <T extends TrpcKeyDictionary>(
  options: LoaderConfig<T>
) => {
  return {
    load(): UseTrpcQueryRecord<T> {
      const route = useRoute();

      const entries: [string, ReturnType<typeof useTrpcQuery>][] =
        Object.entries(options).map(
          ([name, { key, queryOptions, ssrPrefetch }]) => {
            const pathAndInput = computed(() => key(route));
            const resolvedQueryOptions = computed(() => ({
              ...queryOptions,
              enabled: !!pathAndInput.value && queryOptions.enabled
            }));
            const query = useTrpcQuery(pathAndInput, resolvedQueryOptions);
            if (ssrPrefetch) {
              onServerPrefetch(query.suspense);
            }
            return [name, query];
          }
        );

      return Object.fromEntries(entries) as unknown as UseTrpcQueryRecord<T>;
    },

    async preload(route: RouteLocationNormalized, queryClient: QueryClient) {
      if (import.meta.env.SSR) return;

      const client = useClient();
      const awaitedPreloads: Promise<any>[] = [];

      Object.values(options).forEach(
        ({ key, queryOptions, waitPreloadBeforeNavigation }) => {
          const pathAndInput = key(route);
          const resolvedQueryOptions = {
            cacheTime: queryOptions.cacheTime,
            staleTime: queryOptions.staleTime
          };

          if (!pathAndInput) return;
          const promise = queryClient.prefetchQuery(
            pathAndInput,
            () => (client as any).query(...pathAndInput),
            resolvedQueryOptions
          );

          if (waitPreloadBeforeNavigation) {
            awaitedPreloads.push(
              promise.then(() => {
                console.log(`${pathAndInput[0]} preloaded`);
              })
            );
          }
        }
      );

      console.log(awaitedPreloads);
      await Promise.all(awaitedPreloads);
    }
  };
};
