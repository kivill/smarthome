import { RouteRecordRaw } from 'vue-router';
import appRoutes from '../app/app-routes';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('../app/MainLayout.vue'),
    children: [
      ...appRoutes,
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('../shared/pages/Error404.vue'),
  },
];

export default routes;
