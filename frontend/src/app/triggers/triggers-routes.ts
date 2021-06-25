export default [
  {
    path: '/triggers',
    name: 'triggers',
    meta: {
      roles: ['admin']
    },
    component: () => import('./pages/Triggers.vue')
  },
];
