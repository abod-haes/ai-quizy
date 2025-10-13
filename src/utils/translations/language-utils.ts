import { Lang } from "./dictionary-utils";
import { myCookies } from "../cookies";

export function getDirection(lang: string): "rtl" | "ltr" {
  return lang === "ar" ? "rtl" : "ltr";
}

export function getLocalizedRoute(lang: Lang, path: string): string {
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return cleanPath ? `/${lang}/${cleanPath}` : `/${lang}`;
}

export const getCurrentLang = async () => {
  const { cookies } = await import("next/headers");
  return (await cookies()).get(myCookies.lang)?.value || ("en" as Lang);
};
