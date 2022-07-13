import type { inferHandlerInput } from '@trpc/server';
import type { Ref } from 'vue';
import { TQueries, TQueryValues } from 'trpc-nuxt/dist/runtime/client';
import { InferQueryOutput } from '../utils';
import { QueryKey, UseQueryOptions, UseQueryReturnType } from 'vue-query';

declare module 'vue-query' {
  function useQuery<
    TQueryFnData = unknown,
    TError = unknown,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey
  >(
    options:
      | UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>
      | Ref<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>>
  ): UseQueryReturnType<TData, TError>;
}

export type TrpcQueryPath = keyof TQueryValues & string;
export type PathAndInput<TPath extends TrpcQueryPath> = [
  path: TPath,
  ...args: inferHandlerInput<TQueries[TPath]>
];

type MaybeRef<T> = T | Ref<T>;

export const useTrpcQuery = <TPath extends TrpcQueryPath>(
  pathAndInput: MaybeRef<PathAndInput<TPath>>,
  options?: MaybeRef<UseQueryOptions<InferQueryOutput<TPath>>>
) => {
  const client = useClient();

  const resolvedOptions = computed(() => {
    return {
      queryKey: unref(pathAndInput) || [],
      queryFn: () => (client as any).query(...(unref(pathAndInput) || [])),
      ...unref(options || {})
    };
  });

  return useQuery<InferQueryOutput<TPath>>(resolvedOptions);
};
