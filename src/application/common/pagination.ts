export const defaultPage = 1;
export const defaultPageSize = 20;

export interface PaginationRequest {
  page?: number;
  pageSize?: number;
}

export interface PaginationResult<T> {
  total: number;
  data: T[];
}
