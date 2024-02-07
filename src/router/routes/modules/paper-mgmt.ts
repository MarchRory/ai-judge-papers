import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const PAPER_MGMT: AppRouteRecordRaw = {
  path: '/paper-mgmt',
  name: 'paper-mgmt',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.paper-mgmt',
    requiresAuth: true,
    icon: 'icon-book', // TODO: replace me
    order: 4,
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

export default PAPER_MGMT;
