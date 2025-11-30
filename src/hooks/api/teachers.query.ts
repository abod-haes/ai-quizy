"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { teachersService } from "@/services/teachers.service";
import { TeachersQueryParams, TeacherBrief } from "@/types/teacher.type";
import { queryKeys } from "@/utils/query-keys";

export function useTeachers(
  params?: TeachersQueryParams,
  options?: Omit<
    UseQueryOptions<import("@/types/teacher.type").TeachersResponse, Error>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery({
    queryKey: queryKeys.teacher.getList(params),
    queryFn: () => teachersService.getTeachers(params),
    ...options,
  });
}

export function useTeacherBriefs(
  options?: Omit<
    UseQueryOptions<TeacherBrief[], Error>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery({
    queryKey: queryKeys.teacher.getBriefs(),
    queryFn: () => teachersService.getTeacherBriefs(),
    ...options,
  });
}
