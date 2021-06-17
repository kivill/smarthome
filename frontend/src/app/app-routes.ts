import analyticsRoutes from './analytics/analytics-routes';
import appsRoutes from './apps/apps-routes';
import authRoutes from './auth/auth-routes';
import eventRoutes from './events/events-routes';
import mfoRoutes from './mfo/mfo-routes';
import spendingsRoutes from './spendings/spendings-routes';
import usersRoutes from './users/users-routes';

export default [
  ...analyticsRoutes,
  ...appsRoutes,
  ...authRoutes,
  ...eventRoutes,
  ...mfoRoutes,
  ...spendingsRoutes,
  ...usersRoutes,
]
