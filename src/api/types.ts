/**
 * Shared types for API
 */

import { extend } from 'lodash';

/**
 * 携带分页参数
 */
export type Paging<T extends object> = T & {
  page: number;
  pageSize: number;
};

export interface ListResponse<T> {
  total: number;
  list: T[];
}

export type NestArr<T extends object> = T & {
  [key: string]: any;
  children: NestArr<T>[] | null;
};
