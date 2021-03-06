import * as trpc from '@trpc/server';
import { pokemonRouter } from '@/features/pokemon/trpc-router';

export const router = trpc.router().merge('pokemon.', pokemonRouter);
