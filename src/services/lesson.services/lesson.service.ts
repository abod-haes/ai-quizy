import { PartialQueryParams } from "@/utils/query-keys";
import { api } from "../base.service";
import { END_POINTS } from "@/utils/query-apis";
import { Lesson, CreateLessonInput } from "./lesson.type";
import { PaginatedResponse } from "@/types/common.type";

export const lessonServices = {
  async getLessons(params?: PartialQueryParams): Promise<PaginatedResponse<Lesson>> {
    const response = await api.get<PaginatedResponse<Lesson>>(
      END_POINTS.LESSON.GET_LESSONS(params)
    );
    return response.data;
  },

  async createLesson(data: CreateLessonInput): Promise<Lesson> {
    const response = await api.post<Lesson>(END_POINTS.LESSON.CREATE_LESSON, data);
    return response.data;
  },

  async createLessonsList(data: CreateLessonInput[]): Promise<Lesson[]> {
    const response = await api.post<Lesson[]>(END_POINTS.LESSON.CREATE_LESSONS_LIST, data);
    return response.data;
  },

  async updateLesson(id: string, data: CreateLessonInput): Promise<Lesson> {
    const response = await api.put<Lesson>(END_POINTS.LESSON.UPDATE_LESSON(id), data);
    return response.data;
  },

  async deleteLesson(id: string): Promise<void> {
    await api.delete(END_POINTS.LESSON.DELETE_LESSON(id));
  },

  async getLessonById(id: string): Promise<Lesson> {
    const response = await api.get<Lesson>(END_POINTS.LESSON.GET_LESSON_BY_ID(id));
    return response.data;
  },
};

