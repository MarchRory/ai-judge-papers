import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const PERSONAL_CENTER: AppRouteRecordRaw = {
  path: '/personal-center',
  name: 'personal-center',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.personal-center',
    requiresAuth: true,
    icon: 'icon-user',
    order: 7,
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

export default PERSONAL_CENTER;
