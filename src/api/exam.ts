import request from '@/utils/request';
import { ListResponse, Paging } from './types';
import { Question } from './question';

const schema = '/study/exam';

// 考试本体crud接口
const enum ExamApi {
  create = `${schema}/create`,
  update = `${schema}/update`,
  delete = `${schema}/delete`,
  list = `${schema}/list`,
  detail = `${schema}/detail`,
  addProblem = `${schema}/addProblem`,
  uploadTemplate = `${schema}/upload`, // 上传考试excel模板
  sheetList = `${schema}/answerSheet/list`, // 获取上传到某考试中的学生的答题卡列表
  problemList = `${schema}/problemList`,
}

// 考试组crud接口
const groupSchema = `${schema}/group`;
const enum ExamGroupApi {
  creat = `${groupSchema}/create`,
  update = `${groupSchema}/update`,
  list = `${groupSchema}/list`,
  delete = `${groupSchema}/delete`,
}

/**
 * ExamUpdateReq
 */
export interface ExamFormData {
  description: string;
  id?: number;
  groupId: number | null;
  name: string;
  state: number | undefined;
  subject: number | undefined;
  time: number | undefined;
  timeLimit: number;
  type: number | undefined;
  [property: string]: any;
}

export interface ExamFileParams {
  file: File;
  sheet?: string;
  examId: number;
}

export interface addProblemParams {
  examId: number;
  problemId: number;
  score: number;
  order: number;
  type: false;
}

export interface ExamListItem {
  id: number;
  name: string;
  groupId: number;
  groupName: string;
  description: string;
  state: number;
  type: number;
  subject: string;
  subjectId: number;
  time: number;
  timeLimit: number;
}

export function createExamApi(data: Omit<ExamFormData, 'id'>) {
  return request.post(ExamApi.create, data);
}

export function updateExamApi(data: ExamFormData) {
  return request.post(ExamApi.update, data);
}

export function deleteExamApi(id: number) {
  return request.post(ExamApi.delete, { id });
}

export function getExamListApi(data: Paging & { key: string }) {
  return request.post<ListResponse<ExamListItem>>(ExamApi.list, data);
}

export function uploadExamTemplateApi({ file, sheet = '', examId }: ExamFileParams) {
  return request.upload(ExamApi.uploadTemplate, file, { sheet, examId });
}

export function addProblemApi(data: addProblemParams) {
  return request.post(ExamApi.addProblem, data);
}

export function getAnswerSheetListApi(data: Paging<{ examId: number; key?: string }>) {
  return request.post(ExamApi.sheetList, data);
}

export function getExamDetailApi(data: { id: number }) {
  return request.post<ExamListItem>(ExamApi.detail, data);
}

export interface Group {
  id: number;
  description: string;
  name: string;
  state: number | null;
  time: number | string;
  timeLimit: number | string;
  [property: string]: any;
}

export function createGroupApi(data: Omit<Group, 'id'>) {
  return request.post(ExamGroupApi.creat, data);
}

export function updateGroupApi(data: Group) {
  return request.post(ExamGroupApi.update, data);
}
// order: 1-升序, 其他数字-降序
export function getGroupList(data: Paging<{ key: string; order: number }>) {
  return request.post<ListResponse<Group>>(ExamGroupApi.list, data);
}

export function deleteGroupApi(id: number) {
  return request.post(ExamGroupApi.delete, { id });
}

export function getProblemList(examId: number) {
  return request.post<ListResponse<Question>>(ExamApi.problemList, { examId });
}
