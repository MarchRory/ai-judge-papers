import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const USER_MGMT: AppRouteRecordRaw = {
  path: '/user-mgmt',
  name: 'user-mgmt',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: '师生管理',
    requiresAuth: true,
    icon: 'icon-user-group',
    order: 2,
  },
  children: [
    {
      // TODO: replace me
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

export default USER_MGMT;
