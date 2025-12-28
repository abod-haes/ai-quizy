import { queryKeys } from "@/utils/query-keys";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { classesServices } from "./classes.services";
import { CreateClassInput } from "./classes.type";
import { PartialQueryParams } from "@/utils/query-keys";

const queryKey = queryKeys.classes;

export function useClassesBrief() {
  return useQuery({
    queryKey: queryKey.getBrief(),
    queryFn: () => classesServices.getClassesBrief(),
  });
}

export function useClasses(params?: PartialQueryParams) {
  return useQuery({
    queryKey: queryKey.getList(params),
    queryFn: () => classesServices.getClasses(params),
  });
}

export function useCreateClass() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateClassInput) =>
      classesServices.createClass(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return query.queryKey[0] === "class" && query.queryKey[1] === "list";
        },
      });
      queryClient.invalidateQueries({ queryKey: queryKey.getBrief() });
    },
  });
}
