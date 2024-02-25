import axios from 'axios';
import { ListResponse, Paging } from './types';

const schema = 'study/subject';

const enum SubjectApi {
  create = `${schema}/create`,
  delete = `${schema}/delete`,
  page = `${schema}/list`,
  update = `${schema}/update`,
}

export interface SubjectItem {
  [key: string]: string | number | undefined;
  id?: number;
  name: string;
  type: number;
  state: number;
  description: string;
  icon: string;
}

export function createSubjectAPI(data: SubjectItem) {
  return axios.post(SubjectApi.create, data);
}

export function updateSubjectAPI(data: SubjectItem) {
  return axios.post(SubjectApi.update, data);
}

export function getSubjectListAPI(data: Paging<{ key: string }>) {
  return axios.post<ListResponse<SubjectItem>>(SubjectApi.page, data);
}

export function deleteSubjectAPI(id: number) {
  return axios.post(SubjectApi.delete, { id });
}
