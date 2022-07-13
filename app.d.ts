declare module '#app' {
  interface PageMeta {
    loader?: {
      load: () => any;
      preload: (
        route: RouteLocationNormalized,
        queryClient: QueryClient
      ) => Promise<void>;
    };
  }
}

export {};
