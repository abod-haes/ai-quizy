import { NextRequest, NextResponse } from "next/server";
import { dashboardRoutesName, routesName } from "../constant";
import { i18n, type Lang } from "../translations/dictionary-utils";

/**
 * Checks if the current pathname is a dashboard route.
 * Dashboard is disabled in the public Quizy experience, so these routes redirect home.
 */
function isDashboardRoute(pathname: string): boolean {
  const pathWithoutLang = pathname
    .split("/")
    .filter((segment) => segment && !i18n.langs.includes(segment as Lang))
    .join("/");

  const dashboardPaths: string[] = [];
  for (const route of Object.values(dashboardRoutesName)) {
    if (typeof route === "object" && route !== null && "href" in route) {
      dashboardPaths.push(route.href);
    }
  }

  const normalizedPath = pathWithoutLang.startsWith("/")
    ? pathWithoutLang
    : `/${pathWithoutLang}`;

  return dashboardPaths.some(
    (dashboardPath) =>
      normalizedPath === dashboardPath ||
      normalizedPath.startsWith(`${dashboardPath}/`),
  );
}

export async function authMiddleware(
  request: NextRequest,
): Promise<NextResponse | null> {
  const pathname = request.nextUrl.pathname;

  if (!isDashboardRoute(pathname)) {
    return null;
  }

  const lang = pathname.split("/")[1] || i18n.defaultLang;
  const homeUrl = new URL(`/${lang}${routesName.home.href}`, request.url);
  return NextResponse.redirect(homeUrl);
}
