import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const EXAM_MGMT: AppRouteRecordRaw = {
  path: '/exam-mgmt',
  name: 'exam-mgmt',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.exam-mgmt',
    requiresAuth: true,
    icon: 'icon-subscribed', // TODO: replace me
    order: 3,
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

export default EXAM_MGMT;
