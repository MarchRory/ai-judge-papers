import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const CLASS_MGMT: AppRouteRecordRaw = {
  path: '/class-mgmt',
  name: 'class-mgmt',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.class-mgmt',
    requiresAuth: true,
    icon: 'icon-user-group', // TODO: replace me
    order: 2,
  },
  children: [
    {
      path: 'workplace',
      name: 'Workplace',
      component: () => import('@/views/dashboard/workplace/index.vue'),
      meta: {
        locale: 'menu.dashboard.workplace',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default CLASS_MGMT;
