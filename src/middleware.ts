import { NextRequest, NextResponse } from "next/server";
import { langMiddleware } from "./utils/middlewares/lang-middleware";
import { authMiddleware } from "./utils/middlewares/auth-middleware";

export async function middleware(request: NextRequest) {
  const langResult = langMiddleware(request);
  if (langResult) {
    return langResult;
  }

  const authResult = await authMiddleware(request);
  if (authResult) return authResult;

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|svgs|robots\\.txt|sitemap\\.xml|manifest\\.json|sw\\.js|workbox-.*\\.js).*)",
  ],
};
