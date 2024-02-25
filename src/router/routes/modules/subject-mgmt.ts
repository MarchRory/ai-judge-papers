import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const SUBJECT_MGMT: AppRouteRecordRaw = {
  path: '/subject-mgmt',
  name: 'subject-mgmt',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: '学科管理',
    requiresAuth: true,
    icon: 'icon-book', // TODO: replace me
    order: 6,
  },
  children: [
    {
      path: 'index',
      name: 'icon-book',
      component: () => import('@/views/subject-mgmt/index.vue'),
      meta: {
        locale: '学科管理',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default SUBJECT_MGMT;
