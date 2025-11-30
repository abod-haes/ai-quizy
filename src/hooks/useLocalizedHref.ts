"use client";

import { TRouteName } from "@/utils/constant";
import { useCurrentLang } from "./useCurrentLang";

export function useLocalizedHref() {
  const lang = useCurrentLang();

  const getLocalizedHref = (path: TRouteName): string => {
    // Ensure path starts with /
    const normalizedPath = (path as string).startsWith("/") ? path : `/${path}`;
    return `/${lang}${normalizedPath}`;
  };

  return getLocalizedHref;
}
