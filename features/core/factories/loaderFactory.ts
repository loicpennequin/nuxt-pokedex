import { Ref } from 'vue';
import { QueryClient, UseQueryOptions } from 'vue-query';
import { RouteLocationNormalized } from 'vue-router';
import { PathAndInput, TrpcQueryPath } from '../composables/useTrpcQuery';

type TrpcLoaderFunction<
  T extends TrpcQueryPath,
  TDeps extends Record<string, any>
> = (route: RouteLocationNormalized, deps: TDeps) => PathAndInput<T> | null;

export type TrpcKeyDictionary = Record<string, TrpcQueryPath>;

type LoaderDependencies<T extends TrpcKeyDictionary> = Partial<{
  // [Property in keyof T]: ReturnType<
  //   typeof useTrpcQuery<T[Property]>
  // >['data']['value'];
  [Property in keyof T]: any;
}>;

export type LoaderConfig<T extends TrpcKeyDictionary> = {
  [Property in keyof T]: {
    key: TrpcLoaderFunction<T[Property], LoaderDependencies<T>>;
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
      const resolvedData: LoaderDependencies<T> = reactive({});

      function isEnabled(pathAndInput: Ref<any>, ssrPrefetch: boolean) {
        if (import.meta.env.SSR && !ssrPrefetch) return false;
        return !!pathAndInput.value;
      }
      const entries: [string, ReturnType<typeof useTrpcQuery>][] =
        Object.entries(options).map(
          ([name, { key, queryOptions, ssrPrefetch }]) => {
            const pathAndInput = computed(() => key(route, resolvedData));
            const resolvedQueryOptions = computed(() => {
              return {
                ...queryOptions,
                enabled:
                  isEnabled(pathAndInput, ssrPrefetch) && queryOptions.enabled
              };
            });

            const query = useTrpcQuery(pathAndInput, resolvedQueryOptions);
            if (ssrPrefetch) {
              onServerPrefetch(() => {
                if (query.fetchStatus.value === 'idle') {
                  console.error('Cannot ssrPrefetch an idle query', name);
                  return;
                }
                return query.suspense();
              });
            }

            watch(
              query.data,
              newData => {
                // @ts-ignore
                resolvedData[name as keyof T] = newData;
              },
              { immediate: true }
            );

            return [name, query];
          }
        );

      return Object.fromEntries(entries) as unknown as UseTrpcQueryRecord<T>;
    },

    async preload(route: RouteLocationNormalized, queryClient: QueryClient) {
      return new Promise<void>(resolve => {
        if (import.meta.env.SSR) return;

        const client = useClient();

        const queryKeys = new Map<keyof T, PathAndInput<any>>();
        const resolvedData: LoaderDependencies<T> = {};

        function resolveQueryKeys() {
          let isDone = true;
          Object.entries(options).forEach(([name, options]) => {
            resolveQueryKey(name, options.key);
            if (!queryKeys.has(name)) return;
            if (!resolvedData[name]) {
              preloadQuery(name, options);
              if (options.waitPreloadBeforeNavigation) {
                isDone = false;
              }
            }
          });

          if (isDone) resolve();
        }

        // eslint-disable-next-line @typescript-eslint/ban-types
        function resolveQueryKey(key: keyof T, fn: Function) {
          const pathAndInput = fn(route, resolvedData);
          if (pathAndInput) queryKeys.set(key, pathAndInput);
        }

        function preloadQuery(name: keyof T, { key, queryOptions }: any) {
          const pathAndInput = key(route, resolvedData);
          const resolvedQueryOptions = {
            cacheTime: queryOptions.cacheTime,
            staleTime: queryOptions.staleTime
          };

          if (!pathAndInput) return;
          queryClient
            .prefetchQuery(
              pathAndInput,
              () => (client as any).query(...pathAndInput),
              resolvedQueryOptions
            )
            .then(() => {
              resolvedData[name] = queryClient.getQueryData(pathAndInput);
              resolveQueryKeys();
            });
        }

        resolveQueryKeys();
      });
    }
  };
};
