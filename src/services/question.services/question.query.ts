import { PartialQueryParams, queryKeys } from "@/utils/query-keys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { questionServices } from "./question.service";
import { CreateQuestionInput } from "./question.type";

const queryKey = queryKeys.question;

export function useQuestions(params?: PartialQueryParams) {
  return useQuery({
    queryKey: queryKey.getList(params),
    queryFn: () => questionServices.getQuestions(params),
  });
}

export function useCreateQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateQuestionInput) => questionServices.createQuestion(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        predicate: (query) => {
          return query.queryKey[0] === "question" && query.queryKey[1] === "list";
        },
      });
    },
  });
}

export function useUpdateQuestion(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateQuestionInput) =>
      questionServices.updateQuestion(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        predicate: (query) => {
          return query.queryKey[0] === "question" && query.queryKey[1] === "list";
        },
      });
      queryClient.invalidateQueries({ queryKey: queryKey.detail(id) });
    },
  });
}

export function useDeleteQuestion(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => questionServices.deleteQuestion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        predicate: (query) => {
          return query.queryKey[0] === "question" && query.queryKey[1] === "list";
        },
      });
      queryClient.invalidateQueries({ queryKey: queryKey.detail(id) });
    },
  });
}

export function useQuestionById(id: string) {
  return useQuery({
    queryKey: queryKey.detail(id),
    queryFn: () => questionServices.getQuestionById(id),
    enabled: !!id,
  });
}


