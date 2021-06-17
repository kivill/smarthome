export default [
  {
    path: '/spendings',
    name: 'spendings',
    meta: {
      roles: ['admin', 'user']
    },
    component: () => import('./pages/Spendings.vue')
  },
];
