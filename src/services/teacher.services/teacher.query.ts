import { PartialQueryParams, queryKeys } from "@/utils/query-keys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { teacherServices } from "./teacher.service";
import { CreateTeacherInput } from "./teacher.type";

const queryKey = queryKeys.teacher;

export function useTeachers(params?: PartialQueryParams) {
  return useQuery({
    queryKey: queryKey.getList(params),
    queryFn: () => teacherServices.getTeachers(params),
  });
}

export function useTeachersBrief() {
  return useQuery({
    queryKey: queryKey.getBriefs(),
    queryFn: () => teacherServices.getTeachersBrief(),
  });
}

export function useCreateTeacher() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTeacherInput) =>
      teacherServices.createTeacher(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return (
            query.queryKey[0] === "teacher" && query.queryKey[1] === "list"
          );
        },
      });
    },
  });
}

export function useUpdateTeacher(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTeacherInput) =>
      teacherServices.updateTeacher(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return (
            query.queryKey[0] === "teacher" && query.queryKey[1] === "list"
          );
        },
      });
      queryClient.invalidateQueries({ queryKey: queryKey.detail(id) });
    },
  });
}

export function useDeleteTeacher(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => teacherServices.deleteTeacher(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return (
            query.queryKey[0] === "teacher" && query.queryKey[1] === "list"
          );
        },
      });
      queryClient.invalidateQueries({ queryKey: queryKey.detail(id) });
    },
  });
}

export function useTeacherById(id: string) {
  return useQuery({
    queryKey: queryKey.detail(id),
    queryFn: () => teacherServices.getTeacherById(id),
    enabled: !!id,
  });
}
