import { NextRequest, NextResponse } from "next/server";
import { myCookies, readCookieFromCookies } from "../cookies";
import { dashboardRoutesName, routesName } from "../constant";
import { i18n, type Lang } from "../translations/dictionary-utils";
import { roleType } from "../enum/common.enum";
import type { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

/**
 * Checks if the current pathname is a dashboard route
 */
function isDashboardRoute(pathname: string): boolean {
  // Extract the path after language prefix (e.g., /ar/dashboard -> /dashboard)
  const pathWithoutLang = pathname
    .split("/")
    .filter((segment) => segment && !i18n.langs.includes(segment as Lang))
    .join("/");

  // Extract href from route objects, excluding functions
  const dashboardPaths: string[] = [];
  for (const route of Object.values(dashboardRoutesName)) {
    if (typeof route === "object" && route !== null && "href" in route) {
      dashboardPaths.push(route.href);
    }
  }

  // Check if pathname matches any dashboard path
  const normalizedPath = pathWithoutLang.startsWith("/")
    ? pathWithoutLang
    : `/${pathWithoutLang}`;

  return dashboardPaths.some(
    (dashboardPath) =>
      normalizedPath === dashboardPath ||
      normalizedPath.startsWith(`${dashboardPath}/`),
  );
}

/**
 * Gets current user from cookies (stored by AuthProvider)
 * Returns:
 * - { role: number } if user is found in cookies
 * - null if user cookie doesn't exist or is invalid
 */
function getCurrentUserFromCookies(
  cookies: ReadonlyRequestCookies | RequestCookies,
): { role: number } | null {
  try {
    const userCookie = readCookieFromCookies(myCookies.user, cookies);
    if (!userCookie) {
      return null;
    }

    const user = JSON.parse(userCookie);
    return user?.role !== undefined ? { role: user.role } : null;
  } catch {
    // Invalid cookie data, treat as not authenticated
    return null;
  }
}

/**
 * Auth middleware to protect dashboard routes
 * - Checks if route is a dashboard route
 * - Verifies authentication token exists
 * - Fetches user data and checks if user has ADMIN role
 * - Redirects to sign-in if not authenticated
 * - Redirects to home if not admin
 */
export async function authMiddleware(
  request: NextRequest,
): Promise<NextResponse | null> {
  const pathname = request.nextUrl.pathname;

  // Only protect dashboard routes
  if (!isDashboardRoute(pathname)) {
    return null; // Allow non-dashboard routes
  }

  // Check for auth token
  const token = readCookieFromCookies(myCookies.auth, request.cookies);

  if (!token) {
    // No token found, redirect to sign-in
    const lang = pathname.split("/")[1] || "ar"; // Extract lang from pathname
    const signInUrl = new URL(`/${lang}${routesName.signin.href}`, request.url);
    signInUrl.searchParams.set("redirect", pathname); // Preserve intended destination
    return NextResponse.redirect(signInUrl);
  }

  // Get user data from cookies (stored by AuthProvider)
  const user = getCurrentUserFromCookies(request.cookies);

  // If null, user not found in cookies - redirect to sign-in
  if (user === null) {
    const lang = pathname.split("/")[1] || "ar";
    const signInUrl = new URL(`/${lang}${routesName.signin.href}`, request.url);
    signInUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Check if user has ADMIN role
  if (user.role !== roleType.ADMIN) {
    // Not admin, redirect to home
    const lang = pathname.split("/")[1] || "ar";
    const homeUrl = new URL(`/${lang}${routesName.home.href}`, request.url);
    return NextResponse.redirect(homeUrl);
  }

  // User is admin, allow through
  return null;
}
