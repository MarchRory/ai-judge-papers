import request from '@/utils/request/index';
import { Paging } from './types';
import { createFormData } from './utils';

export interface Question {
  title: string;
  content: string;
  subject: number;
  state: number;
  expectedDifficulty: number;
  source: string;
}
export type QuestionListItem = Omit<Question, 'subject'> & { id: number; subject: { id: number; icon: string; title: string } };

export function createQuestion(q: Question) {
  return request.post<Question>('/study/problem/create', q);
}

export function deleteQuestion(id: number) {
  return request.post('/study/problem/delete', { id });
}

export function listQuestion(
  data: Paging<{
    key: string;
    subjectId: number | string;
  }>,
) {
  return request.post<{
    total: number;
    list: QuestionListItem[];
  }>('/study/problem/list', data);
}

export function getQuestionDetail(id: number) {
  return request.post('/study/problem/detail', { id });
}

export function updateQuestion(q: Question) {
  return request.post('/study/problem/detail', q);
}

export function uploadQuestion(file: File, sheet?: string) {
  return request.post('/study/problem/upload', createFormData({ file, sheet }));
}
