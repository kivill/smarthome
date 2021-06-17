export default [
  {
    path: '/users',
    name: 'users',
    meta: {
      roles: ['admin']
    },
    component: () => import('./pages/Users.vue')
  },
];
