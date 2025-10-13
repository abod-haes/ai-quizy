"use client";

import { TRouteName } from "@/utils/constant";
import { useCurrentLang } from "./useCurrentLang";

/**
 * Custom hook to create localized hrefs with language prefix
 * @returns A function that takes a path and returns it with the current language prefix
 *
 * @example
 * const getLocalizedHref = useLocalizedHref();
 * <Link href={getLocalizedHref("/dashboard")}>Dashboard</Link>
 * // Returns: "/ar/dashboard" or "/en/dashboard" based on current language
 */
export function useLocalizedHref() {
  const lang = useCurrentLang();

  const getLocalizedHref = (path: TRouteName): string => {
    // Ensure path starts with /
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `/${lang}${normalizedPath}`;
  };

  return getLocalizedHref;
}
