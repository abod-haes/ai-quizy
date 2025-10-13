export interface ApiResponse<T> {
  data: T;
  pagination?: PaginationMeta;
  message: string;
  statusCode: number;
  timestamp: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  error: {
    message: string;
    error: string;
    statusCode: number;
  };
}

export interface PaginationMeta {
  limit: number;
  currentPage: number;
  total: number;
  totalPages: number;
  nextPage: number | null;
  prevPage: number | null;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination: PaginationMeta;
}
