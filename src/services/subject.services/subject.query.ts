import { queryKeys } from "@/utils/query-keys";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { subjectServices } from "./subject.services";
import { CreateSubjectInput } from "./subject.type";
import { PartialQueryParams } from "@/utils/query-keys";

const queryKey = queryKeys.subject;

export function useSubjectsBrief() {
  return useQuery({
    queryKey: queryKey.getBrief(),
    queryFn: () => subjectServices.getSubjectsBrief(),
  });
}

export function useSubjects(params?: PartialQueryParams) {
  return useQuery({
    queryKey: queryKey.getList(params),
    queryFn: () => subjectServices.getSubjects(params),
  });
}

export function useCreateSubject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateSubjectInput) => subjectServices.createSubject(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return query.queryKey[0] === "subject" && query.queryKey[1] === "list";
        },
      });
      queryClient.invalidateQueries({ queryKey: queryKey.getBrief() });
    },
  });
}

export function useUpdateSubject(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateSubjectInput) =>
      subjectServices.updateSubject(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return query.queryKey[0] === "subject" && query.queryKey[1] === "list";
        },
      });
      queryClient.invalidateQueries({ queryKey: queryKey.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKey.getBrief() });
    },
  });
}

export function useDeleteSubject(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => subjectServices.deleteSubject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return query.queryKey[0] === "subject" && query.queryKey[1] === "list";
        },
      });
      queryClient.invalidateQueries({ queryKey: queryKey.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKey.getBrief() });
    },
  });
}

export function useSubjectById(id: string) {
  return useQuery({
    queryKey: queryKey.detail(id),
    queryFn: () => subjectServices.getSubjectById(id),
    enabled: !!id,
  });
}