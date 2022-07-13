import { computed, onServerPrefetch, reactive, watch } from 'vue';
import { UseQueryReturnType } from 'vue-query';
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router';
import { TrpcQueryPath } from '../composables/useTrpcQuery';
import { LoaderOptions, QueriesOptions, RouteQueryMapFn } from './loader.model';

export class QueryLoader<T> {
  name: string;

  private queriesOptions: QueriesOptions<T>;

  private resolvedData = reactive<Partial<T>>({});

  constructor({ name, queriesOptions }: LoaderOptions<T>) {
    this.name = name;
    this.queriesOptions = queriesOptions;
  }

  private getQueries(route: RouteLocationNormalizedLoaded, ssrQueries: any[]) {
    const entries = Object.entries<RouteQueryMapFn<any>>(
      this.queriesOptions
    ).map(([key, queryDef]) => {
      const query = this.getQuery<any>(queryDef, route, key, ssrQueries);

      return [key, query];
    });

    return Object.fromEntries(entries);
  }

  private getQuery<T = any>(
    queryDef: RouteQueryMapFn<T>,
    route: RouteLocationNormalizedLoaded,
    key: string,
    ssrQueries: any[]
  ) {
    const query = useTrpcQuery(
      computed(
        () =>
          queryDef(route).queryKey(this.resolvedData) as [TrpcQueryPath, any]
      ),
      computed(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { dependsOn, queryKey, ...resolvedOptions } = queryDef(route);
        return {
          ...resolvedOptions,
          enabled:
            this.name === route.name &&
            dependsOn?.every(key => !!this.resolvedData[key])
        } as any;
      })
    );

    watch(
      () => query.data,
      data => {
        this.resolvedData[key] = data;
      },
      { immediate: true }
    );

    if (queryDef(route).ssrPrefetch) {
      ssrQueries.push(query);
    }

    return query;
  }

  run() {
    const route = useRoute();
    const ssrQueries: UseQueryReturnType<unknown, unknown>[] = [];
    const queries = this.getQueries(route, ssrQueries);

    onServerPrefetch(() =>
      Promise.allSettled(ssrQueries.map(q => q.suspense()))
    );

    return queries;
  }
}
