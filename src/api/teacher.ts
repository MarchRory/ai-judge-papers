import axios from 'axios';
import { TableData } from '@arco-design/web-vue';
import { withPaging } from './utils';

// TODO: {field: value}
export interface Teacher extends TableData {
  id: number;
  name: string;
  phone: string;
  number: string;
  sex: number;
  graduation: number;
  state: number;
}

/**
 * 字段转换为可读格式
 */
export const fieldsDescription: { [field in keyof Teacher]: string } = {
  id: 'id',
  name: '姓名',
  phone: '手机',
  number: 'number',
  sex: '性别',
  graduation: 'graduation',
  state: '账号启用',
} as const;

export function createTeacher(t: Teacher) {
  return axios.post<Teacher>('/organization/teacher/create', t);
}

export function deleteTeacher(id: number) {
  return axios.post('/organization/teacher/delete', { id });
}

export function listTeacher(
  data: {
    name?: Teacher['name'];
    state: Teacher['state'];
  },
  page = 1
) {
  return axios.post<{
    total: number;
    list: Teacher[];
  }>('/organization/teacher/list', withPaging(data, page));
}

export function updateTeacher(t: Partial<Teacher>) {
  return axios.post<Teacher>('/organization/teacher/update', t);
}
