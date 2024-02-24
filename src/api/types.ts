/**
 * Shared types for API
 */

/**
 * 携带分页参数
 */
export type Paging<T extends object> = T & {
  page: number;
  pageSize: number;
};
