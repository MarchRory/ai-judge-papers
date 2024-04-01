import { Pagination } from '@/types/global';
import request from '@/utils/request/index';
import { ListResponse } from './types';

const schema = '/study/judge/';

const enum JudgeApi {
  submit = `${schema}/submit`,
  beginJudge = `${schema}/doJudge`, // 启动AI阅卷
  problemList = `${schema}/list`,
  stuScoreList = `${schema}/scoreList`,
  updateProblemRes = `${schema}/update`, // 更新判题结果=, 对指定题目进行复审
}

export interface Answer {
  problemId: number;
  answer: string;
  /** 答案类型(ai/人脑) */
  type: number;
}

export interface KnowledgePoints {
  title: string;
  description: string;
  /** subject */
  type: number;
}

/**
 * 提交阅卷结果, 生成考试成绩
 * @param id 考试id
 * @returns
 */
export const submitJudgeRes = (id: number) => {
  return request.post(JudgeApi.submit, { id });
};

/**
 * 启动对当前考试的AI判卷
 * @param id 考试id
 * @returns
 */
export const beginAiJudge = (id: number) => {
  return request.post(JudgeApi.beginJudge, { id });
};

export interface PaperDetail {
  id: number;
  problemId: number;
  result: string;
  score: number;
  totalScore: number;
  url: string;
  studentAnswer: string;
}

/**
 * 获取判题列表
 * @returns
 */
export const getPaperDetail = (data: Pagination & { examId: number; userId: number }) => {
  return request.post<ListResponse<PaperDetail>>(JudgeApi.problemList, data);
};

/**
 * 获取学生分数列表
 * @returns
 */
export const getScoreList = () => {
  return request.post(JudgeApi.stuScoreList);
};

/**
 * 修改指定题目的判题结果
 * @param data id: 题目id, result: 阅卷评论, score: 更正分数
 * @returns
 */
export const passJudge = (data: { id: number; result: string; score: number }) => {
  return request.post(JudgeApi.updateProblemRes, data);
};
