import request from '@/utils/request/index'
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
  return request.post(SubjectApi.create, data);
}

export function updateSubjectAPI(data: SubjectItem) {
  return request.post(SubjectApi.update, data);
}

export function getSubjectListAPI(data: Paging<{ key: string }>) {
  return request.post<ListResponse<SubjectItem>>(SubjectApi.page, data, {}, { cache: true });
}

export function deleteSubjectAPI(id: number) {
  return request.post(SubjectApi.delete, { id });
}
