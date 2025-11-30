"use client";

import { usePathname } from "next/navigation";
import { useLocalizedHref } from "@/hooks/useLocalizedHref";
import { type TRouteName } from "@/utils/constant";

export function useActiveLink() {
  const pathname = usePathname();
  const getLocalizedHref = useLocalizedHref();

  const isLinkActive = (href: TRouteName): boolean => {
    // Skip function routes (like quizzesDetails)
    if (typeof href === "function") return false;

    const localizedHref = getLocalizedHref(href);
    // Remove trailing slash for comparison
    const normalizedPathname = pathname.replace(/\/$/, "");
    const normalizedHref = localizedHref.replace(/\/$/, "");

    // Special handling for home route - must be exact match
    if (href === "/") {
      // Home should only match exactly /[lang] or /[lang]/
      return normalizedPathname === normalizedHref;
    }

    // For other routes: exact match or pathname starts with href + "/"
    return (
      normalizedPathname === normalizedHref ||
      normalizedPathname.startsWith(normalizedHref + "/")
    );
  };

  return { isLinkActive };
}
