import type { inferHandlerInput } from '@trpc/server';
import { UseInfiniteQueryOptions } from 'vue-query';
import { TQueries, TQueryValues } from 'trpc-nuxt/dist/runtime/client';
import { InferQueryOutput } from '../utils';

export const useInfiniteTrpcQuery = <TPath extends keyof TQueryValues & string>(
  pathAndInput: [path: TPath, ...args: inferHandlerInput<TQueries[TPath]>],
  options: UseInfiniteQueryOptions<InferQueryOutput<TPath>>
) => {
  const client = useClient();

  return useInfiniteQuery<InferQueryOutput<TPath>>(
    pathAndInput,
    ({ pageParam }) => {
      const [path, input] = pathAndInput;
      const actualInput = { ...(input as any), offset: pageParam };

      return (client as any).query(path, actualInput);
    },
    options
  );
};
