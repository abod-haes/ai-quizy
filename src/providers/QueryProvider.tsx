"use client";

import React from "react";
import { fiveMinutesStaleTime } from "@/lib/react-query-config";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
   defaultOptions: {
      queries: {
         staleTime: fiveMinutesStaleTime,
         gcTime: fiveMinutesStaleTime,
         refetchOnWindowFocus: false,
         refetchOnReconnect: false,
      },
   },
});

const ReactQueryProvider = ({ children }: { children: React.ReactNode }) => {
   return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
   );
};

export default ReactQueryProvider;
