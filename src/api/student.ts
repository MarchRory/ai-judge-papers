import axios, { AxiosResponse } from 'axios';
import { TableData } from '@arco-design/web-vue';
import { withPaging } from './utils';
import { DEFAULT_PAGE_SIZE } from './types';

export interface Student extends TableData {
  id: number;
  number: string;
  name: string;
  sex: number;
  class: string;
  grade: string;
  graduation: number;
  state: number;
}

export const fieldsDescription: { [field in keyof Student]: string } = {
  id: 'ID',
  number: '学号',
  name: '姓名',
  sex: '性别',
  class: '班级',
  grade: '年级',
  graduation: 'graduation',
  state: '状态',
};

export function createStudent(data: Omit<Student, 'id'>) {
  return axios.post<Student>('/organization/student/create', data);
}

export function deleteStudent(id: number) {
  return axios.post('/organization/student/delete', { id });
}

export async function listStudent(
  data: {
    name?: Student['name'];
    state?: Student['state'];
  } = { state: -1 },
  page = 1
) {
  const res = await axios.post('/organization/student/list', withPaging(data, page));

  return { ...res, data: { ...res.data, totalPage: res.data.total / DEFAULT_PAGE_SIZE } } as AxiosResponse<{
    totalPage: number;
    list: Student[];
  }>;
}

export function updateStudent(t: Partial<Student>) {
  return axios.post<Student>('/organization/student/update', t);
}
