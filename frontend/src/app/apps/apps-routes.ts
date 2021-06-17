export default [
  {
    path: '/apps',
    name: 'apps',
    meta: {
      roles: ['admin']
    },
    component: () => import('./pages/Apps.vue')
  },
  {
    path: '/spendings_by_card',
    name: 'spendings_by_card',
    meta: {
      roles: ['admin', 'user']
    },
    component: () => import('./pages/SpendingsByApp.vue')
  },
];
