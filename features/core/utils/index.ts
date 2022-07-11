import type { inferProcedureOutput } from '@trpc/server';
import {
  TQueries,
  TQueryValues,
  inferProcedures
} from 'trpc-nuxt/dist/runtime/client';
import type { router } from '~~/server/trpc';

type AppRouter = typeof router;

export type TMutations = AppRouter['_def']['mutations'];

export type TMutationValues = inferProcedures<AppRouter['_def']['mutations']>;

export type InferQueryOutput<TRouteKey extends keyof TQueryValues & string> =
  inferProcedureOutput<TQueries[TRouteKey]>;

export type InferMutationOutput<
  TRouteKey extends keyof TMutationValues & string
> = inferProcedureOutput<TMutations[TRouteKey]>;
