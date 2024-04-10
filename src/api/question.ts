import request from '@/utils/request/index';
import { ListResponse, Paging } from './types';
import { createFormData } from './utils';

/** backend type: ExamProblem */
export interface Question {
  problemId: number;
  title: string;
  content: string;
  state: number;
  expectedDifficulty: number;
  source: string;
  /** 题目类型(0,简答,1选择,2填空,3判断) */
  type: 0 | 1 | 2 | 3;
  score: number;
  /** 题目排序 */
  order: number;
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
    subjectId?: number | string;
  }>,
) {
  return request.post<ListResponse<QuestionListItem>>('/study/problem/list', data);
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
