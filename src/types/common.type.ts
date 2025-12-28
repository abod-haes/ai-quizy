export type ApiResponse<T> = T;

export interface ApiError {
  type: string;
  title: string;
  status: number;
  traceId: string;
  code?: string;
  detail?: string;
  errors?: {
    [key: string]: string[];
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export interface BriefAPIS {
  id: string;
  name: string;
}
