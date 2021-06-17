export default [
  {
    path: '/postbacks',
    name: 'postbacks',
    meta: {
      roles: ['admin', 'user']
    },
    component: () => import('./pages/Postbacks.vue')
  },
];
