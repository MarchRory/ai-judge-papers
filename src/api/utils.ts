/**
 * Share utilities for API
 */

/**
 * 默认每页数量
 */
const DEFAULT_PAGE_SIZE = 50;

/**
 * 携带分页参数
 */
export type Paging<T extends object = object> = T & {
  page: number;
  pageSize: number;
};

export function withPaging<T extends object>(data: T, page = 1, pageSize = DEFAULT_PAGE_SIZE): Paging<T> {
  return { page, pageSize, ...data };
}
