import { PartialQueryParams, queryKeys } from "@/utils/query-keys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { unitServices } from "./unit.service";
import { CreateUnitInput } from "./unit.type";

const queryKey = queryKeys.unit;

export function useUnits(params?: PartialQueryParams) {
  return useQuery({
    queryKey: queryKey.getList(params),
    queryFn: () => unitServices.getUnits(params),
  });
}

export function useCreateUnit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateUnitInput) => unitServices.createUnit(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return query.queryKey[0] === "unit" && query.queryKey[1] === "list";
        },
      });
    },
  });
}

export function useUpdateUnit(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateUnitInput) =>
      unitServices.updateUnit(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return query.queryKey[0] === "unit" && query.queryKey[1] === "list";
        },
      });
      queryClient.invalidateQueries({ queryKey: queryKey.detail(id) });
    },
  });
}

export function useDeleteUnit(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => unitServices.deleteUnit(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return query.queryKey[0] === "unit" && query.queryKey[1] === "list";
        },
      });
      queryClient.invalidateQueries({ queryKey: queryKey.detail(id) });
    },
  });
}

export function useUnitById(id: string) {
  return useQuery({
    queryKey: queryKey.detail(id),
    queryFn: () => unitServices.getUnitById(id),
    enabled: !!id,
  });
}
