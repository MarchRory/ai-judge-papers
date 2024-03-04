import axios from 'axios';
import { Paging } from './types';
import { queryChatList } from './message';

export interface Question {
  title: string;
  content: string;
  subject: number;
  state: number;
  expectedDifficulty: number;
  source: string;
}

export function createQuestion(q: Question) {
  return axios.post<Question>('/study/problem/create', q);
}

export function deleteQuestion(id: number) {
  return axios.post('/study/problem/delete', { id });
}

export function listQuestion(
  data: Paging<{
    key: string;
    examId: number;
  }>
) {
  return axios.post<{
    total: number;
    list: Question[];
  }>('/study/problem/list', data);
}

export function getQuestionDetail(id: number) {
  return axios.post('/study/problem/detail', { id });
}

export function updateQuestion(q: Question) {
  return axios.post('/study/problem/detail', q);
}
