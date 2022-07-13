import * as trpc from '@trpc/server';
import { pokemonRouter } from '@/features/pokemon/trpc-router';

export const router = trpc
  .router()
  .query('hello', {
    resolve: () => {
      return 'Hello World';
    }
  })
  .merge('pokemon.', pokemonRouter);
