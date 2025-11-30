import { api } from "./base.service";
import {
  Subject,
  SubjectsResponse,
  SubjectsQueryParams,
  SubjectBrief,
} from "@/types/subject.type";
import { END_POINTS } from "@/utils/query-apis";

export const subjectsService = {
  async getSubjects(params?: SubjectsQueryParams): Promise<SubjectsResponse> {
    const endpoint = END_POINTS.SUBJECT.GET_SUBJECTS(params);

    const response = await api.get<SubjectsResponse>(endpoint);
    return response.data;
  },

  async getSubjectById(id: string): Promise<Subject> {
    const response = await api.get<Subject>(
      END_POINTS.SUBJECT.GET_SUBJECT_BY_ID(id),
    );
    return response.data;
  },

  async getSubjectBriefs(): Promise<SubjectBrief[]> {
    const response = await api.get<SubjectBrief[]>(
      END_POINTS.SUBJECT.GET_SUBJECT_BRIEFS,
    );
    return response.data;
  },
};
