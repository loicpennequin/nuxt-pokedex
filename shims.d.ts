import { RouteLocationNormalized, RouteRecordNormalized } from 'vue-router';
import { QueryClient } from 'vue-query';

declare module 'vue-virtual-scroller' {
  // eslint-disable-next-line @typescript-eslint/ban-types
  export type RecycleScroller = DefineComponent<{}, {}, any>;
}
