export default [
  {
    path: '/events',
    name: 'events',
    meta: {
      roles: ['admin']
    },
    component: () => import('./pages/Events.vue')
  },
];
