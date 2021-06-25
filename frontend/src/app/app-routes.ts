import analyticsRoutes from './readings/readings-routes';
import appsRoutes from './triggers/triggers-routes';
import authRoutes from './auth/auth-routes';
import eventRoutes from './events/events-routes';
import usersRoutes from './users/users-routes';

export default [
  ...analyticsRoutes,
  ...appsRoutes,
  ...authRoutes,
  ...eventRoutes,
  ...usersRoutes,
]
