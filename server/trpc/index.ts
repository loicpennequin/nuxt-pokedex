import * as trpc from '@trpc/server';

export const router = trpc.router().query('hello', {
  resolve: () => {
    return 'Hello World';
  }
});
