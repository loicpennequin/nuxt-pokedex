import { QueryClient } from 'vue-query';
import { RouteLocationNormalized } from 'vue-router';
import { LoaderOptions, QueriesOptions, RouteQueryMapFn } from './loader.model';

export type PromiseRecord<T = any> = Record<string, Promise<T>>;

export class QueryPreloader<T> {
  private queriesOptions: QueriesOptions<T>;

  private requiredPreloads: Promise<any>[] = [];

  private preloadsMap: PromiseRecord = {};

  private isPreloading = false;

  constructor({ queriesOptions }: Omit<LoaderOptions<T>, 'name'>) {
    this.queriesOptions = queriesOptions;
  }

  private sleep(duration: number) {
    return new Promise(res => {
      setTimeout(res, duration);
    });
  }

  private async preloadDependencies(dependsOn: string[]) {
    const deps = await Promise.all(
      dependsOn.map(depKey => this.preloadsMap[depKey])
    );

    return Object.fromEntries(dependsOn.map((depKey, i) => [depKey, deps[i]]));
  }

  private async getPreloadPromise(
    options: ReturnType<RouteQueryMapFn<any>>,
    queryClient: QueryClient
  ) {
    await this.sleep(0);
    const { queryKey, staleTime, cacheTime, dependsOn = [] } = options;
    const deps = await this.preloadDependencies(dependsOn);
    const client = useClient();

    return queryClient.fetchQuery(
      queryKey(deps),
      async ({ queryKey }) => (client as any).query(...queryKey),
      { staleTime, cacheTime }
    );
  }

  private preloadQuery(
    queryDef: RouteQueryMapFn<any>,
    nextRoute: RouteLocationNormalized,
    key: string,
    queryClient: QueryClient
  ) {
    const options = queryDef(nextRoute);
    const promise = this.getPreloadPromise(options, queryClient);

    this.preloadsMap[key] = promise;
    if (options.waitUntilPreloaded) this.requiredPreloads.push(promise);
  }

  private async flushRequiredPreloads() {
    await Promise.all(this.requiredPreloads);
    this.requiredPreloads = [];
  }

  private startPreloads(
    nextRoute: RouteLocationNormalized,
    queryClient: QueryClient
  ) {
    Object.entries(this.queriesOptions).forEach(
      ([key, queryDef]: [string, any]) => {
        this.preloadQuery(queryDef, nextRoute, key, queryClient);
      }
    );
  }

  async run(nextRoute: RouteLocationNormalized, queryClient: QueryClient) {
    if (!window.navigator.onLine) {
      this.isPreloading = false;
      return;
    }

    if (!this.isPreloading) {
      this.isPreloading = true;
      this.startPreloads(nextRoute, queryClient);
    }

    await this.flushRequiredPreloads();
    this.isPreloading = false;
  }
}
