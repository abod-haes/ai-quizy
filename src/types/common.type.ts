export type ApiResponse<T> = T;
export interface PaginationResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}
export interface ApiError {
  type: string;
  title: string;
  status: number;
  traceId: string;
  errors: {
    [key: string]: string[];
  };
}
