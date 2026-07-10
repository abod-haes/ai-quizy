import { useQuery } from "@tanstack/react-query";
import { queryKeys, PartialQueryParams } from "@/utils/query-keys";
import { salesCenterServices } from "./sales-center.services";

export function usePointsOfSale(params?: PartialQueryParams) {
  return useQuery({
    queryKey: queryKeys.salesCenter.getList(params),
    queryFn: () => salesCenterServices.getSalesCenters(params),
  });
}
