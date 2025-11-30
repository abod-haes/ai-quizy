import { ApiResponse } from "./common.type";

export interface Subject {
  id: string;
  name: string;
}

export type SubjectsResponse = ApiResponse<Subject[]>;

export interface SubjectsQueryParams {
  Page?: number;
  PerPage?: number;
}

export interface SubjectBrief {
  id: string;
  name: string;
}

