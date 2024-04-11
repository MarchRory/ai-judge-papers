import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const QUESTION_MGMT: AppRouteRecordRaw = {
  path: '/question-mgmt',
  name: 'question-mgmt',
  component: DEFAULT_LAYOUT, // TODO: replace me
  redirect: '/question-mgmt/question',
  meta: {
    locale: '题库管理',
    requiresAuth: true,
    hideChildrenInMenu: true,
    icon: 'icon-tags',
    order: 4,
    roles: ['root', 'problem'],
  },
  children: [
    {
      path: 'question',
      name: 'question',
      component: () => import('@/views/question-mgmt/index.vue'),
      meta: {
        locale: '题库列表',
        activeMenu: 'question-mgmt',
        requiresAuth: true,
        roles: ['root', 'problem'],
      },
    },
  ],
};

export default QUESTION_MGMT;
