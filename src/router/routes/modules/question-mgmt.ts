import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const QUESTION_MGMT: AppRouteRecordRaw = {
  path: '/question-mgmt',
  name: 'question-mgmt',
  component: DEFAULT_LAYOUT, // TODO: replace me
  meta: {
    locale: '题库管理',
    requiresAuth: true,
    icon: 'icon-tags',
    order: 4,
  },
  children: [
    {
      path: 'question',
      name: 'question',
      component: () => import('@/views/question-mgmt/index.vue'),
      meta: {
        locale: '题库列表',
        requiresAuth: true,
        roles: ['root', 'problem'],
      },
    },
  ],
};

export default QUESTION_MGMT;
