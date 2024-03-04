import axios, { AxiosResponse } from 'axios';
import { TableData } from '@arco-design/web-vue';
import { withPaging } from './utils';
import { DEFAULT_PAGE_SIZE } from './types';

// TODO: {field: value}
export interface Teacher extends TableData {
  id: number;
  name: string;
  phone: string;
  number: string;
  sex: number;
  state: number;
  /**
   * timestamp, use new Date()
   */
  createdAt: number;
}

/**
 * 字段转换为可读格式
 */
export const fieldsDescription: { [field in keyof Teacher]: string } = {
  id: 'ID',
  name: '姓名',
  phone: '手机号',
  number: '教工号',
  sex: '性别',
  state: '账号启用',
  createdAt: '创建时间',
} as const;

export function createTeacher(data: Omit<Teacher, 'id'>) {
  return axios.post<Teacher>('/organization/teacher/create', data);
}

export function deleteTeacher(id: number) {
  return axios.post('/organization/teacher/delete', { id });
}

export async function listTeacher(
  data: {
    name?: Teacher['name'];
    state?: Teacher['state'];
  } = { state: -1 },
  page = 1
) {
  const res = await axios.post('/organization/teacher/list', withPaging(data, page));

  return { ...res, data: { ...res.data, totalPage: res.data.total / DEFAULT_PAGE_SIZE } } as AxiosResponse<{
    totalPage: number;
    list: Teacher[];
  }>;
}

export function updateTeacher(data: Partial<Teacher>) {
  return axios.post<Teacher>('/organization/teacher/update', data);
}
