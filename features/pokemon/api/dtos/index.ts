import { z } from 'zod';

export const findAllPokemonsDto = z.object({
  limit: z.number(),
  offset: z.number()
});

export type FindAllPokemonsDto = z.infer<typeof findAllPokemonsDto>;
