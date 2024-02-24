import axios from 'axios';
import { withPaging } from './utils';

// TODO:
export interface Teacher {
  id: number;
  name: string;
  phone: string;
  number: string;
  sex: number;
  graduation: number;
  state: number;
}

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
