import { PartialQueryParams, queryKeys } from "@/utils/query-keys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { studentService } from "./student.service";
import { Student } from "./student.type";

const queryKey = queryKeys.student;

export function useStudents(params?: PartialQueryParams) {
  return useQuery({
    queryKey: queryKey.getList(params),
    queryFn: () => studentService.getStudents(params),
  });
}

export function useCreateStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Student) => studentService.createStudent(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKey.getList(),
      });
    },
  });
}

export function useUpdateStudent(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Student) => studentService.updateStudent(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKey.getList(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKey.detail(id),
      });
    },
  });
}

export function useDeleteStudent(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => studentService.deleteStudent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKey.getList(),
      });
    },
  });
}

export function useStudentById(id: string) {
  return useQuery({
    queryKey: queryKey.detail(id),
    queryFn: () => studentService.getStudentById(id),
  });
}
