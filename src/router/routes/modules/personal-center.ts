import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const PERSONAL_CENTER: AppRouteRecordRaw = {
  path: '/personal-center',
  name: 'personal-center',
  component: DEFAULT_LAYOUT, // TODO: replace me
  meta: {
    locale: '个人中心',
    requiresAuth: false,
    icon: 'icon-user',
    order: 8,
  },
};

export default PERSONAL_CENTER;
