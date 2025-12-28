import { PartialQueryParams } from "@/utils/query-keys";
import { api } from "../base.service";
import { END_POINTS } from "@/utils/query-apis";
import { Teacher, CreateTeacherInput } from "./teacher.type";

export const teacherServices = {
  async getTeachers(params?: PartialQueryParams) {
    const response = await api.get(END_POINTS.TEACHER.GET_TEACHERS(params));
    return response.data;
  },

  async createTeacher(data: CreateTeacherInput) {
    const response = await api.post(END_POINTS.TEACHER.CREATE_TEACHER, data);
    return response.data;
  },
  async updateTeacher(id: string, data: CreateTeacherInput): Promise<Teacher> {
    const response = await api.put(END_POINTS.TEACHER.UPDATE_TEACHER(id), data);
    return response.data;
  },
  async deleteTeacher(id: string): Promise<void> {
    const response = await api.delete(END_POINTS.TEACHER.DELETE_TEACHER(id));
    return response.data;
  },
  async getTeacherById(id: string): Promise<Teacher> {
    const response = await api.get(END_POINTS.TEACHER.GET_TEACHER_BY_ID(id));
    return response.data;
  },
};
