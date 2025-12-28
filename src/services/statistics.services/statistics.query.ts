import { useQuery } from "@tanstack/react-query";
import { statisticsService } from "./statistics.service";
import { queryKeys } from "@/utils/query-keys";

export function useStatistics() {
  return useQuery({
    queryKey: queryKeys.statistics.getStatistics(),
    queryFn: () => statisticsService.getStatistics(),
  });
}

