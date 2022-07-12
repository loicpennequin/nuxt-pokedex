import * as trpc from '@trpc/server';
import { z } from 'zod';

const pokemonApi = <T>(url: string, options: any): Promise<T> =>
  $fetch<T>(url, {
    ...options,
    baseURL: 'https://pokeapi.co/api/v2'
  }) as Promise<T>;

const ENDPOINTS = {
  POKEMON: '/pokemon',
  EVOLUTION_CHAIN: '/evolution-chain',
  SPECIES: '/pokemon-species'
};

export const pokemonRouter = trpc.router().query('findAll', {
  input: z.object({
    limit: z.number(),
    offset: z.number()
  }),
  resolve: ({ input: { limit, offset } }) => {
    return pokemonApi<any>(ENDPOINTS.SPECIES, {
      params: {
        limit,
        offset
      }
    });
  }
});
