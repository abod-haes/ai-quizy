import { NextRequest, NextResponse } from "next/server";
import { i18n, Lang } from "../translations/dictionary-utils";
import { match as matchLocale } from "@formatjs/intl-localematcher";

import { myCookies, readCookieFromCookies } from "../cookies";
import Negotiator from "negotiator";

export function getLang(request: NextRequest): string {
  const cookieLang = readCookieFromCookies(myCookies.lang, request.cookies);

  if (cookieLang && i18n.langs.includes(cookieLang as Lang)) {
    return cookieLang;
  }

  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    negotiatorHeaders[key] = value;
  });

  const langs = [...i18n.langs];
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    langs,
  );
  return matchLocale(languages, langs, i18n.defaultLang);
}

export function langMiddleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const pathnameIsMissingLang = i18n.langs.every(
    (lang: Lang) =>
      !pathname.startsWith(`/${lang}/`) && pathname !== `/${lang}`,
  );

  if (pathnameIsMissingLang) {
    const lang = getLang(request);
    const newUrl = new URL(
      `/${lang}${pathname.startsWith("/") ? "" : "/"}${pathname}`,
      request.url,
    );
    return NextResponse.redirect(newUrl);
  }
}
