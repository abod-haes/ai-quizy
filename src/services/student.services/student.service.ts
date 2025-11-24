import { END_POINTS } from "@/utils/query-apis";
import { api } from "../base.service";
import { PaginatedResponse } from "@/types/screen.types";
import { Student } from "./student.type";
import { PartialQueryParams } from "@/utils/query-keys";

export const studentService = {
  async getStudents(params?: PartialQueryParams): Promise<PaginatedResponse<Student[]>> {
    const response = await api.get(END_POINTS.STUDENT.GET_STUDENTS(params));
    return response.data;
  },

  async createStudent(data: Student): Promise<Student> {
    const response = await api.post(END_POINTS.STUDENT.CREATE_STUDENT, data);
    return response.data;
  },

  async updateStudent(id: string, data: Student): Promise<Student> {
    const response = await api.put(END_POINTS.STUDENT.UPDATE_STUDENT(id), data);
    return response.data;
  },

  async deleteStudent(id: string): Promise<void> {
    const response = await api.delete(END_POINTS.STUDENT.DELETE_STUDENT(id));
    return response.data;
  },

  async getStudentById(id: string): Promise<Student> {
    const response = await api.get(END_POINTS.STUDENT.GET_STUDENT_BY_ID(id));
    return response.data;
  },
};  