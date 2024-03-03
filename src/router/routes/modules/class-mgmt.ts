import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const CLASS_MGMT: AppRouteRecordRaw = {
  path: '/class-mgmt',
  name: 'class-mgmt',
  component: DEFAULT_LAYOUT, // TODO: replace me
  redirect: '/class-mgmt/class',
  meta: {
    locale: '班级管理',
    requiresAuth: true,
    hideChildrenInMenu: true,
    icon: 'icon-interaction', // TODO: replace me
    order: 3,
    roles: ['root', 'class'],
  },
  children: [
    {
      path: 'class',
      name: 'class',
      component: () => import('@/views/class-mgmt/index.vue'),
      meta: {
        locale: '班级管理',
        requiresAuth: true,
        activeMenu: 'class-mgmt',
        roles: ['root', 'class'],
      },
    },
  ],
};

export default CLASS_MGMT;
