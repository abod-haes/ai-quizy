import { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export const myCookies = {
  lang: "NEXT_LANG",
  auth: "NEXT_AUTH_TOKEN_quizy",
  sidebar: "sidebar_state",
};

const isProduction = process.env.NODE_ENV === "production";

export function setCookie(name: string, value: string, permanent = true) {
  const maxAge = permanent ? 60 * 60 * 24 * 365 : 60 * 60 * 24 * 1;
  const options = [
    `path=/`,
    `SameSite=Lax`,
    isProduction ? `Secure` : null,
    `Max-Age=${maxAge}`,
  ]
    .filter(Boolean)
    .join("; ");

  document.cookie = `${name}=${encodeURIComponent(value)}; ${options}`;
}

export async function deleteCookie(name: string) {
  if (typeof document === "undefined") {
    // Server-side
    const { cookies } = await import("next/headers");
    (await cookies()).delete(name);
  } else {
    // Client-side
    const options = [
      `path=/`,
      `SameSite=Lax`,
      isProduction ? `Secure` : null,
      `Max-Age=0`,
    ]
      .filter(Boolean)
      .join("; ");
    document.cookie = `${name}=; ${options}`;
  }
}

export function readCookieFromCookies(
  cookieName: string,
  cookies: ReadonlyRequestCookies | RequestCookies,
) {
  return cookies.get(cookieName)?.value;
}

export function readCookieFromDocument(name: string): string | undefined {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1];
}

export async function getAuthHeader(): Promise<HeadersInit> {
  let token: string | undefined;

  if (typeof document !== "undefined") {
    // Client side
    token = readCookieFromDocument(myCookies.auth);
  } else {
    // Server side
    const { cookies } = await import("next/headers");
    token = readCookieFromCookies(myCookies.auth, await cookies());
  }

  return token ? { Authorization: `Bearer ${token}` } : {};
}
