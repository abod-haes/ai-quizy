"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import {
  Quiz,
  QuizzesQueryParams,
  SubmitQuizResultsInput,
  QuizResultsResponse,
  CreateQuizInput,
} from "@/services/quizes.services/quiz.type";
import { queryKeys } from "@/utils/query-keys";
import { PaginatedResponse } from "@/types/common.type";
import { quizzesService } from "./quizes.service";

export function useQuizzes(
  params?: QuizzesQueryParams,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<Quiz>, Error>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery({
    queryKey: queryKeys.quiz.getList(params),
    queryFn: () => quizzesService.getQuizzes(params),
    ...options,
  });
}

export function useQuizById(
  id: string,
  options?: Omit<UseQueryOptions<Quiz, Error>, "queryKey" | "queryFn">,
) {
  return useQuery({
    queryKey: queryKeys.quiz.detail(id),
    queryFn: () => quizzesService.getQuizById(id),
    enabled: !!id,
    ...options,
  });
}

export function useSubmitQuizResults(quizId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SubmitQuizResultsInput) =>
      quizzesService.submitQuizResults(quizId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.quiz.detail(quizId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.quiz.getList(),
      });
    },
  });
}

export function useQuizResults(
  quizId: string,
  options?: Omit<
    UseQueryOptions<QuizResultsResponse, Error>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery({
    queryKey: [...queryKeys.quiz.detail(quizId), "results"],
    queryFn: () => quizzesService.getQuizResults(quizId),
    enabled: !!quizId,
    ...options,
  });
}

export function useCreateQuiz() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateQuizInput) => quizzesService.createQuiz(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.quiz.getList(),
      });
    },
  });
}

export function useUpdateQuiz(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateQuizInput) => quizzesService.updateQuiz(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.quiz.getList(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.quiz.detail(id),
      });
    },
  });
}

export function useDeleteQuiz(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => quizzesService.deleteQuiz(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.quiz.getList(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.quiz.detail(id),
      });
    },
  });
}
