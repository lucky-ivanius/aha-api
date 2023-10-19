export interface PaginationResponseDto<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
}
