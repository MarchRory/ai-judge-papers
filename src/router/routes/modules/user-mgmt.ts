import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const USER_MGMT: AppRouteRecordRaw = {
  path: '/teacher-stu-mgmt',
  name: 'teacher-stu-mgmt',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: '师生管理',
    requiresAuth: true,
    icon: 'icon-user-group',
    order: 2,
  },
  children: [
    {
      path: 'teacher',
      name: 'teacher',
      component: () => import('@/views/user-mgmt/teacher/index.vue'),
      meta: {
        locale: '教师管理',
        requiresAuth: true,
        roles: ['root', 'teacher'],
      },
    },
    {
      path: 'student',
      name: 'student',
      component: () => import('@/views/user-mgmt/student/index.vue'),
      meta: {
        locale: '学生管理',
        requiresAuth: true,
        roles: ['root', 'stu'],
      },
    },
  ],
};

export default USER_MGMT;
