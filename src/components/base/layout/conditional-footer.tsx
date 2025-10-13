"use client";

import { usePathname } from "next/navigation";
import FooterSection from "@/components/base/footer/footer";
import { routesName } from "@/utils/constant";

export function ConditionalFooter() {
  const pathname = usePathname();

  // Hide footer on AI assistant page
  const hideFooter = pathname.includes(routesName.aiAssistant);

  if (hideFooter) {
    return null;
  }

  return <FooterSection />;
}
