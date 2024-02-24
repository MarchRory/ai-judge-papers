import axios from 'axios';
import { Paging } from './types';

export interface Class {
  name: string;
  grade: string;
  teacherId: object;
}

export function createClass(c: Class) {
  return axios.post<Class>('/organization/class/create', c);
}

export function deleteClass(id: number) {
  return axios.post('/organization/class/delete', { id });
}

export function listClass(
  data: Paging<{
    key: string;
    grade: string;
  }>
) {
  return axios.post<{
    total: number;
    list: Class[];
  }>('/organization/class/list', data);
}

export function updateClass(c: Class) {
  return axios.post('/organization/class/update', c);
}
