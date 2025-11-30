"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { subjectsService } from "@/services/subjects.service";
import { SubjectsQueryParams, SubjectBrief } from "@/types/subject.type";
import { queryKeys } from "@/utils/query-keys";

export function useSubjects(
  params?: SubjectsQueryParams,
  options?: Omit<
    UseQueryOptions<import("@/types/subject.type").SubjectsResponse, Error>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery({
    queryKey: queryKeys.subject.getList(params),
    queryFn: () => subjectsService.getSubjects(params),
    ...options,
  });
}

export function useSubjectBriefs(
  options?: Omit<UseQueryOptions<SubjectBrief[], Error>, "queryKey" | "queryFn">,
) {
  return useQuery({
    queryKey: queryKeys.subject.getBriefs(),
    queryFn: () => subjectsService.getSubjectBriefs(),
    ...options,
  });
}

