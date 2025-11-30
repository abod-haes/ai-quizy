import { api } from "./base.service";
import { Quiz, QuizzesQueryParams } from "@/types/quiz.type";
import { END_POINTS } from "@/utils/query-apis";
import { PaginationResponse } from "@/types/common.type";

export const quizzesService = {
  async getQuizzes(
    params?: QuizzesQueryParams,
  ): Promise<PaginationResponse<Quiz>> {
    const endpoint = END_POINTS.QUIZ.GET_QUIZZES(params);
    const response = await api.get<PaginationResponse<Quiz>>(endpoint);
    return response.data;
  },

  async getQuizById(id: string): Promise<Quiz> {
    const response = await api.get<Quiz>(END_POINTS.QUIZ.GET_QUIZ_BY_ID(id));
    return response.data;
  },
};
