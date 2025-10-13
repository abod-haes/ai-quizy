import { NextRequest, NextResponse } from "next/server";
import { myCookies, readCookieFromCookies } from "../cookies";
import { i18n, Lang } from "../translations/dictionary-utils";
import { authPaths, privatePaths } from "@/constants/constants";

const isAuthPage = (pathname: string) => {
  return authPaths.some((route) => pathname == `/${route}`);
};
const isPrivatePage = (pathname: string) => {
  return privatePaths.some((route) => pathname == `/${route}`);
};

export function authMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const langs = i18n.langs;

  let pathWithoutLang = pathname;
  for (const lang of langs) {
    if (pathname.startsWith(`/${lang}/`) || pathname === `/${lang}`) {
      pathWithoutLang = pathname.slice(lang.length + 1) || "/";
      break;
    }
  }

  const visitingPrivatePage = isPrivatePage(pathWithoutLang);
  const visitingAuthPages = isAuthPage(pathWithoutLang);
  const authToken = readCookieFromCookies(myCookies.auth, request.cookies);

  if (authToken && visitingAuthPages) {
    const homeUrl = new URL(
      `/${langs.includes(pathname.split("/")[1] as Lang) ? pathname.split("/")[1] : ""}/chat`,
      request.url,
    );
    return NextResponse.redirect(homeUrl);
  }

  if (!authToken && visitingPrivatePage) {
    const langPrefix = langs.includes(pathname.split("/")[1] as Lang)
      ? pathname.split("/")[1]
      : "";
    const loginUrl = new URL(`/${langPrefix}/login`, request.url);
    return NextResponse.redirect(loginUrl);
  }
}
