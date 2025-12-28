import { PartialQueryParams, queryKeys } from "@/utils/query-keys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { lessonServices } from "./lesson.service";
import { CreateLessonInput } from "./lesson.type";

const queryKey = queryKeys.lesson;

export function useLessons(params?: PartialQueryParams) {
  return useQuery({
    queryKey: queryKey.getList(params),
    queryFn: () => lessonServices.getLessons(params),
  });
}

export function useCreateLesson() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateLessonInput) => lessonServices.createLesson(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        predicate: (query) => {
          return query.queryKey[0] === "lesson" && query.queryKey[1] === "list";
        },
      });
    },
  });
}

export function useCreateLessonsList() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateLessonInput[]) => lessonServices.createLessonsList(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        predicate: (query) => {
          return query.queryKey[0] === "lesson" && query.queryKey[1] === "list";
        },
      });
    },
  });
}

export function useUpdateLesson(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateLessonInput) =>
      lessonServices.updateLesson(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        predicate: (query) => {
          return query.queryKey[0] === "lesson" && query.queryKey[1] === "list";
        },
      });
      queryClient.invalidateQueries({ queryKey: queryKey.detail(id) });
    },
  });
}

export function useDeleteLesson(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => lessonServices.deleteLesson(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        predicate: (query) => {
          return query.queryKey[0] === "lesson" && query.queryKey[1] === "list";
        },
      });
      queryClient.invalidateQueries({ queryKey: queryKey.detail(id) });
    },
  });
}

export function useLessonById(id: string) {
  return useQuery({
    queryKey: queryKey.detail(id),
    queryFn: () => lessonServices.getLessonById(id),
    enabled: !!id,
  });
}

