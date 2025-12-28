import { END_POINTS } from "@/utils/query-apis";
import { api } from "../base.service";
import { BriefAPIS, PaginatedResponse } from "@/types/common.type";
import { Subject, CreateSubjectInput } from "./subject.type";
import { PartialQueryParams } from "@/utils/query-keys";

export const subjectServices = {
  async getSubjectsBrief(): Promise<BriefAPIS[]> {
    const response = await api.get(END_POINTS.SUBJECT.GET_SUBJECTS_BRIEF());
    return response.data;
  },

  async getSubjects(params?: PartialQueryParams): Promise<PaginatedResponse<Subject>> {
    const response = await api.get<PaginatedResponse<Subject>>(
      END_POINTS.SUBJECT.GET_SUBJECTS(params)
    );
    return response.data;
  },

  async createSubject(data: CreateSubjectInput): Promise<Subject> {
    const response = await api.post<Subject>(END_POINTS.SUBJECT.CREATE_SUBJECT, data);
    return response.data;
  },

  async updateSubject(id: string, data: CreateSubjectInput): Promise<Subject> {
    const response = await api.put<Subject>(END_POINTS.SUBJECT.UPDATE_SUBJECT(id), data);
    return response.data;
  },

  async deleteSubject(id: string): Promise<void> {
    await api.delete(END_POINTS.SUBJECT.DELETE_SUBJECT(id));
  },

  async getSubjectById(id: string): Promise<Subject> {
    const response = await api.get<Subject>(END_POINTS.SUBJECT.GET_SUBJECT_BY_ID(id));
    return response.data;
  },
};
