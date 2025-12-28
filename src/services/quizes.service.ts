import { api } from "./base.service";
import {
  Quiz,
  QuizzesQueryParams,
  SubmitQuizResultsInput,
  QuizResultsResponse,
} from "@/types/quiz.type";
import { END_POINTS } from "@/utils/query-apis";
import { PaginatedResponse } from "@/types/common.type";

export const quizzesService = {
  async getQuizzes(
    params?: QuizzesQueryParams,
  ): Promise<PaginatedResponse<Quiz>> {
    const endpoint = END_POINTS.QUIZ.GET_QUIZZES(params);
    const response = await api.get<PaginatedResponse<Quiz>>(endpoint);
    return response.data;
  },

  async getQuizById(id: string): Promise<Quiz> {
    const response = await api.get<Quiz>(END_POINTS.QUIZ.GET_QUIZ_BY_ID(id));
    return response.data;
  },

  async submitQuizResults(
    quizId: string,
    data: SubmitQuizResultsInput,
  ): Promise<unknown> {
    const response = await api.post<unknown>(
      END_POINTS.QUIZ.SUBMIT_QUIZ_RESULTS(quizId),
      data,
    );
    return response.data;
  },

  async getQuizResults(quizId: string): Promise<QuizResultsResponse> {
    const response = await api.get<QuizResultsResponse>(
      END_POINTS.QUIZ.GET_QUIZ_RESULTS(quizId),
    );
    return response.data;
  },
};
