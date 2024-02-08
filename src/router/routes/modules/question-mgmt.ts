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
};

export default QUESTION_MGMT;
