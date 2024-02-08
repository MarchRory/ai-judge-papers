import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const PERMISSION_MGMT: AppRouteRecordRaw = {
  path: '/permission-mgmt',
  name: 'permission-mgmt',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: '权限管理',
    requiresAuth: true,
    icon: 'icon-lock',
    order: 1,
  },
  children: [
    // TODO: replace me
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

export default PERMISSION_MGMT;
