import * as trpc from '@trpc/server';
import { z } from 'zod';
import { findAllPokemons, findEvolutionChain, findPokemonByName } from './api';
import { findAllPokemonsDto } from './api/dtos';

export const pokemonRouter = trpc
  .router()
  .query('findAll', {
    input: findAllPokemonsDto,
    resolve: ({ input }) => findAllPokemons(input)
  })
  .query('findOneByName', {
    input: z.string(),
    resolve: ({ input }) => findPokemonByName(input)
  })
  .query('findEvolutionChain', {
    input: z.number(),
    resolve: ({ input }) => findEvolutionChain(input)
  });
