import { useQuery } from "@tanstack/react-query";
import { fakeOrders } from "@/constants/data-mapping";

// simulate network latency
function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

export function useFakeApi({
  url,
  pageIndex,
  pageSize,
  sorting,
}: {
  url: string;
  pageIndex: number;
  pageSize: number;
  sorting?: { id: string; desc: boolean }[];
}) {
  return useQuery({
    queryKey: ["fakeApi", url, pageIndex, sorting],
    queryFn: async () => {
      await delay(400); // simulate latency

      const data = [...fakeOrders];

      // apply sorting (just on client)
      if (sorting && sorting.length > 0) {
        const { id, desc } = sorting[0];
        data.sort((a, b) => {
          if (a[id] < b[id]) return desc ? 1 : -1;
          if (a[id] > b[id]) return desc ? -1 : 1;
          return 0;
        });
      }

      // pagination
      const start = pageIndex * pageSize;
      const end = start + pageSize;

      return {
        rows: data.slice(start, end),
        total: data.length,
      };
    },
  });
}
