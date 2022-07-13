import {
  QueryClient,
  QueryKey,
  UseQueryOptions,
  UseQueryReturnType
} from 'vue-query';
import { RouteLocationNormalized } from 'vue-router';
import { QueryPreloader } from './query-preloader.model';
import { QueryLoader } from './query.loader.model';

export type RouteQueryMapFn<TDeps> = (
  nextRoute: RouteLocationNormalized
) => Omit<UseQueryOptions, 'queryFn' | 'queryKey'> & {
  queryKey: QueryKeyFunction<TDeps>;
  ssrPrefetch?: boolean;
  waitUntilPreloaded?: boolean;
  dependsOn?: string[];
};

export type QueriesOptions<T> = {
  [Property in keyof T]: RouteQueryMapFn<T>;
};

export type LoaderOptions<T> = {
  name: string;
  queriesOptions: QueriesOptions<T>;
};

type QueryKeyFunction<T> = (deps: Partial<T>) => QueryKey;

export interface ILoader<T> {
  name: symbol | string;
  preload(nextRoute: RouteLocationNormalized): Promise<void>;
  getQueries(): Record<string, UseQueryReturnType<T, any>>;
}

export class Loader<T> {
  name: string;

  private queryLoader: QueryLoader<T>;

  private queryPreloader: QueryPreloader<T>;

  constructor({ name, queriesOptions }: LoaderOptions<T>) {
    this.name = name;
    this.queryLoader = new QueryLoader<T>({ name, queriesOptions });
    this.queryPreloader = new QueryPreloader<T>({ queriesOptions });
  }

  async preload(nextRoute: RouteLocationNormalized, queryClient: QueryClient) {
    return this.queryPreloader.run(nextRoute, queryClient);
  }

  getQueries() {
    return this.queryLoader.run();
  }
}
