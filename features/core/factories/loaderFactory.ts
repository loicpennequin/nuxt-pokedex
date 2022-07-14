import { QueryClient, UseQueryOptions } from 'vue-query';
import { RouteLocationNormalized } from 'vue-router';
import { PathAndInput, TrpcQueryPath } from '../composables/useTrpcQuery';
import { objectEntries } from '../utils';

export type TrpcKeyDictionary = Record<string, TrpcQueryPath>;

type LoaderDependencies<T extends TrpcKeyDictionary> = {
  [Property in keyof T]?: ReturnType<
    typeof useTrpcQuery<T[Property]>
  >['data']['value'];
};

export type LoaderConfig<T extends TrpcKeyDictionary> = {
  [Property in keyof T]: (
    route: RouteLocationNormalized,
    deps: Record<string, any>
  ) => {
    key: PathAndInput<T[Property]>;
    queryOptions?: UseQueryOptions;
    ssrPrefetch?: boolean;
    waitPreloadBeforeNavigation?: boolean;
  };
};

type UseTrpcQueryRecord<T extends TrpcKeyDictionary> = {
  [Property in keyof T]: ReturnType<typeof useTrpcQuery<T[Property]>>;
};

type Loader<T extends TrpcKeyDictionary> = {
  load(): UseTrpcQueryRecord<T>;
  preload(
    route: RouteLocationNormalized,
    queryClient: QueryClient
  ): Promise<void>;
};

export const createLoader = <T extends TrpcKeyDictionary>(
  options: LoaderConfig<T>
): Loader<T> => {
  return {
    load() {
      const route = useRoute();
      const resolvedData: LoaderDependencies<T> = reactive({});

      const entries: [keyof T, ReturnType<typeof useTrpcQuery>][] =
        objectEntries(options).map(([name, queryDef]) => {
          const pathAndInput = computed(() => {
            const { key } = queryDef(route, resolvedData);

            return key;
          });

          const resolvedQueryOptions = computed(() => {
            const { queryOptions = {} } = queryDef(route, resolvedData);
            return queryOptions;
          });

          const query = useTrpcQuery(pathAndInput, resolvedQueryOptions as any);

          const { ssrPrefetch } = queryDef(route, resolvedData);
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
              //@ts-ignore
              resolvedData[name as keyof T] = newData;
            },
            { immediate: true }
          );

          return [name, query];
        });

      return Object.fromEntries(entries) as unknown as UseTrpcQueryRecord<T>;
    },
    preload(route: RouteLocationNormalized, queryClient: QueryClient) {
      return new Promise<void>(resolve => {
        if (import.meta.env.SSR) return;

        const client = useClient();

        const queryKeys = new Map<keyof T, PathAndInput<any>>();
        const resolvedData: LoaderDependencies<T> = {};

        function resolveQueryKeys() {
          let isDone = true;
          objectEntries(options).forEach(([name, queryDef]) => {
            const config = queryDef(route, resolvedData);
            const isEnabled =
              !config.queryOptions || config.queryOptions.enabled;
            if (!isEnabled) return;

            queryKeys.set(name, config.key as any);

            if (!resolvedData[name]) {
              preloadQuery(name, config);
              if (options.waitPreloadBeforeNavigation) {
                isDone = false;
              }
            }
          });

          if (isDone) resolve();
        }

        function preloadQuery(name: keyof T, { key, queryOptions }: any) {
          const resolvedQueryOptions = {
            cacheTime: queryOptions.cacheTime,
            staleTime: queryOptions.staleTime || 30_000
          };

          queryClient
            .fetchQuery(
              key,
              () => (client as any).query(...key),
              resolvedQueryOptions
            )
            .then(data => {
              resolvedData[name] = data;
              resolveQueryKeys();
            });
        }

        resolveQueryKeys();
      });
    }
  };
};
