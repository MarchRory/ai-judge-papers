import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const STUDY_ANALYSIS: AppRouteRecordRaw = {
  path: '/study-analysis',
  name: 'study-analysis',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.study-analysis',
    requiresAuth: true,
    icon: 'icon-check-circle',
    order: 5,
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

export default STUDY_ANALYSIS;
