import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const EXAM_MGMT: AppRouteRecordRaw = {
  path: '/exam-mgmt',
  name: 'exam-mgmt',
  component: DEFAULT_LAYOUT,
  redirect: '/exam-mgmt/examIndex',
  meta: {
    locale: '考试管理',
    requiresAuth: true,
    hideChildrenInMenu: true,
    roles: ['root', 'exam'],
    icon: 'icon-subscribed', // TODO: replace me
    order: 5,
  },
  children: [
    {
      path: 'examIndex',
      name: 'examIndex',
      component: () => import('@/views/exam-mgmt/index.vue'),
      meta: {
        locale: '考试管理',
        requiresAuth: true,
        activeMenu: 'exam-mgmt',
        roles: ['root', 'exam'],
      },
    },
  ],
};

export default EXAM_MGMT;
