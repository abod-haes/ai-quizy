"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/base/header/header";
import { routesName } from "@/utils/constant";

export function ConditionalHeader() {
  const pathname = usePathname();

  // Hide header on AI assistant page
  const hideHeader = pathname.includes(routesName.aiAssistant.href);

  if (hideHeader) {
    return null;
  }

  return <Header />;
}
