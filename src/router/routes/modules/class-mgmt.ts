import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const CLASS_MGMT: AppRouteRecordRaw = {
  path: '/class-mgmt',
  name: 'class-mgmt',
  component: DEFAULT_LAYOUT, // TODO: replace me
  meta: {
    locale: '班级管理',
    requiresAuth: true,
    icon: 'icon-interaction', // TODO: replace me
    order: 3,
  },
};

export default CLASS_MGMT;
