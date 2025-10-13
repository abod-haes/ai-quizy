import { Lang } from "./translations/dictionary-utils";

/**
 * Utility function to create localized hrefs with language prefix
 * Use this in non-React contexts or when you already have the language
 *
 * @param path - The route path (e.g., "/dashboard", "/settings")
 * @param lang - The language code (e.g., "ar", "en")
 * @returns The localized path with language prefix
 *
 * @example
 * const href = getLocalizedHref("/dashboard", "ar");
 * // Returns: "/ar/dashboard"
 */
export function getLocalizedHref(path: string, lang: Lang): string {
  // Ensure path starts with /
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `/${lang}${normalizedPath}`;
}
