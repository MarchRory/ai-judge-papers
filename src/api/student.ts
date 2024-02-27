import axios from 'axios';
import { TableData } from '@arco-design/web-vue';
import { withPaging } from './utils';

export interface Student extends TableData {
  id: number;
  number: string;
  name: string;
  sex: number;
  classId: number;
  grade: string;
  graduation: number;
  state: number;
}

export const fieldsDescription: { [field in keyof Student]: string } = {
  id: 'id',
  number: 'number',
  name: 'name',
  sex: 'sex',
  classId: '班级ID',
  grade: 'grade',
  graduation: 'graduation',
  state: 'state',
};

export function createStudent(data: Omit<Student, 'id'>) {
  return axios.post<Student>('/organization/student/create', data);
}

export function deleteStudent(id: number) {
  return axios.post('/organization/student/delete', { id });
}

export function listStudent(
  data: {
    name?: Student['name'];
    state: Student['state'];
  },
  page = 1
) {
  return axios.post<{
    total: number;
    list: Student[];
  }>('/organization/student/list', withPaging(data, page));
}

export function updateStudent(t: Partial<Student>) {
  return axios.post<Student>('/organization/student/update', t);
}
