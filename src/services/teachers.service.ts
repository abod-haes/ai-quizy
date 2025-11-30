import { api } from "./base.service";
import {
  Teacher,
  TeachersResponse,
  TeachersQueryParams,
  TeacherBrief,
} from "@/types/teacher.type";
import { END_POINTS } from "@/utils/query-apis";

export const teachersService = {
  async getTeachers(params?: TeachersQueryParams): Promise<TeachersResponse> {
    const endpoint = END_POINTS.TEACHER.GET_TEACHERS(params);

    const response = await api.get<TeachersResponse>(endpoint);
    return response.data;
  },

  async getTeacherById(id: string): Promise<Teacher> {
    const response = await api.get<Teacher>(
      END_POINTS.TEACHER.GET_TEACHER_BY_ID(id),
    );
    return response.data;
  },

  async getTeacherBriefs(): Promise<TeacherBrief[]> {
    const response = await api.get<TeacherBrief[]>(
      END_POINTS.TEACHER.GET_TEACHER_BRIEFS,
    );
    return response.data;
  },
};
