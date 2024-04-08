import { Pagination } from '@/types/global';
import request from '@/utils/request/index';
import { StuPaperStateEnum } from '@/views/exam-mgmt/config';
import { ListResponse } from './types';

const schema = '/study/judge';

const enum JudgeApi {
  submit = `${schema}/submit`,
  beginJudge = `${schema}/doJudge`, // 启动AI阅卷
  problemList = `${schema}/list`, // 对于userId和problemId得到正在判题的id列表
  stuScoreList = `${schema}/scoreList`,
  updateProblemRes = `${schema}/update`, // 更新判题结果=, 对指定题目进行复审
  getReview = `${schema}/review`, // 根据状态查询在某考试中的学生
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
  /** 当前判题id */
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
export const updateJudge = (data: { id: number; result?: string; score: number } | { id: number; result: string; score?: number }) => {
  return request.post(JudgeApi.updateProblemRes, data);
};

/**
 * 根据状态查询在某考试中的学生
 */
export const getReview = (data: {
  page?: number;
  pageSize?: number;
  examId: number;
  /**
   * 状态
   * 1 AI审核进行中
   * 2 AI初审结束
   * 3 复审中
   * 4 阅卷结束
   * @docs https://swpu.feishu.cn/docx/OMK2df7zOokZgRx0HDScniKPnMb
   */
  state: StuPaperStateEnum;
}) => {
  return request.post<ListResponse<number>>(JudgeApi.getReview, data);
};
