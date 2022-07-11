import type { inferHandlerInput } from '@trpc/server';
import { UseQueryOptions } from 'vue-query';
import { TQueries, TQueryValues } from 'trpc-nuxt/dist/runtime/client';
import { InferQueryOutput } from '../utils';

export const useTrpcQuery = <TPath extends keyof TQueryValues & string>(
  pathAndInput: [path: TPath, ...args: inferHandlerInput<TQueries[TPath]>],
  options?: UseQueryOptions<InferQueryOutput<TPath>>
) => {
  const client = useClient();

  return useQuery<InferQueryOutput<TPath>>(
    pathAndInput,
    () => {
      return (client as any).query(...pathAndInput);
    },
    options
  );
};
