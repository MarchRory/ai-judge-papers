import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const EXAM_MGMT: AppRouteRecordRaw = {
  path: '/exam-mgmt',
  name: 'exam-mgmt',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: '考试管理',
    requiresAuth: true,
    roles: ['root', 'exam'],
    icon: 'icon-subscribed', // TODO: replace me
    order: 5,
  },
};

export default EXAM_MGMT;
