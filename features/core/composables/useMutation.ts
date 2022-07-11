import type { inferHandlerInput } from '@trpc/server';
import { UseMutationOptions } from 'vue-query';
import { InferMutationOutput, TMutations, TMutationValues } from '../utils';

export const useTrpcMutation = <TPath extends keyof TMutationValues & string>(
  pathAndInput: [path: TPath, ...args: inferHandlerInput<TMutations[TPath]>],
  options: UseMutationOptions<InferMutationOutput<TPath>, any, any, any>
) => {
  const client = useClient();

  return useMutation<InferMutationOutput<TPath>>(
    pathAndInput,
    () => {
      return (client as any).mutation(...pathAndInput);
    },
    options
  );
};
