"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { quizzesService } from "@/services/quizes.service";
import { Quiz, QuizzesQueryParams } from "@/types/quiz.type";
import { queryKeys } from "@/utils/query-keys";
import { PaginationResponse } from "@/types/common.type";

export function useQuizzes(
  params?: QuizzesQueryParams,
  options?: Omit<
    UseQueryOptions<PaginationResponse<Quiz>, Error>,
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
