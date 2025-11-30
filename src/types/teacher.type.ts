import { ApiResponse } from "./common.type";

export interface Teacher {
  id: string;
  phoneNumber: string;
  description: string;
  firstName: string;
  lastName: string;
}

export type TeachersResponse = ApiResponse<Teacher[]>;

export interface TeachersQueryParams {
  Page?: number;
  PerPage?: number;
}

export interface TeacherBrief {
  id: string;
  firstName: string;
  lastName: string;
}

