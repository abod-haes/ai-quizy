import { PartialQueryParams } from "@/utils/query-keys";
import { api } from "../base.service";
import { END_POINTS } from "@/utils/query-apis";
import { Question, CreateQuestionInput } from "./question.type";
import { PaginatedResponse } from "@/types/common.type";

export const questionServices = {
  async getQuestions(params?: PartialQueryParams): Promise<PaginatedResponse<Question>> {
    const response = await api.get<PaginatedResponse<Question>>(
      END_POINTS.QUESTION.GET_QUESTIONS(params)
    );
    return response.data;
  },

  async createQuestion(data: CreateQuestionInput): Promise<Question> {
    const response = await api.post<Question>(END_POINTS.QUESTION.CREATE_QUESTION, data);
    return response.data;
  },

  async updateQuestion(id: string, data: CreateQuestionInput): Promise<Question> {
    const response = await api.put<Question>(END_POINTS.QUESTION.UPDATE_QUESTION(id), data);
    return response.data;
  },

  async deleteQuestion(id: string): Promise<void> {
    await api.delete(END_POINTS.QUESTION.DELETE_QUESTION(id));
  },

  async getQuestionById(id: string): Promise<Question> {
    const response = await api.get<Question>(END_POINTS.QUESTION.GET_QUESTION_BY_ID(id));
    return response.data;
  },
};


