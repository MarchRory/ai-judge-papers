import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const PAPER_MGMT: AppRouteRecordRaw = {
  path: '/paper-mgmt',
  name: 'paper-mgmt',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: '答卷管理',
    requiresAuth: true,
    icon: 'icon-book', // TODO: replace me
    order: 6,
  },
};

export default PAPER_MGMT;
