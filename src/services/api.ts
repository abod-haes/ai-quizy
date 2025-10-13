import { ApiResponse, ApiError } from "@/types/common.type";
import { deleteCookie, getAuthHeader, myCookies } from "@/utils/cookies";
// import { getLocalizedRoute } from "@/utils/translations/language-utils";
// import { Lang } from "@/utils/dictionary-utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const authEndpoints = ["/auth/user/register", "/auth/user/login"];

export class ApiService {
  public static async fetchApi<T>(
    endpoint: string,
    options: RequestInit = {},
    withoutAuthHeader?: boolean,
  ): Promise<ApiResponse<T>> {
    try {
      const lang =
        typeof window !== "undefined" &&
        window.location.pathname.startsWith("/ar")
          ? "ar"
          : "en";

      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "Accept-Language": lang,
          ...(withoutAuthHeader ? {} : await getAuthHeader()),
          ...options.headers,
        },

        ...(typeof window == "undefined" ? { cache: "no-store" } : {}),
      });

      let data = {};
      if (response.status === 204) {
        data = {
          data: null,
          meta: { message: "Success with no content" },
        };
      } else {
        data = await response.json();
      }

      if (!response.ok) {
        const error = data as ApiError;
        if (!authEndpoints.includes(endpoint) && response.status === 401) {
          // Handle unauthorized access
          if (typeof document !== "undefined") {
            await deleteCookie(myCookies.auth);
            // helperNavigateTo(getLocalizedRoute(lang, "/login"));
          }
          // toast.error(
          //   error.error?.message ||
          //     error.message ||
          //     (lang === "en"
          //       ? "You've been logged out. Please sign in again."
          //       : "تم تسجيل خروجك. يرجى تسجيل الدخول مرة أخرى.")
          // );
        }

        throw { ...(error || {}), message: error?.message || "Request failed" };
      }

      return data as ApiResponse<T>;
    } catch (error) {
      if (typeof error === "object" && error !== null) {
        throw error;
      }
      throw new Error("An unexpected error occurred");
    }
  }

  public static async get<T>(
    endpoint: string,
    options: RequestInit = {},
    withoutAuthHeader?: boolean,
  ): Promise<ApiResponse<T>> {
    return this.fetchApi<T>(
      endpoint,
      { ...options, method: "GET" },
      withoutAuthHeader,
    );
  }

  public static async post<T>(
    endpoint: string,
    body: unknown,
    options: RequestInit = {},
    withoutAuthHeader?: boolean,
  ): Promise<ApiResponse<T>> {
    return this.fetchApi<T>(
      endpoint,
      {
        ...options,
        method: "POST",
        body: JSON.stringify(body),
      },
      withoutAuthHeader,
    );
  }

  public static async patch<T>(
    endpoint: string,
    body: unknown,
    options: RequestInit = {},
    withoutAuthHeader?: boolean,
  ): Promise<ApiResponse<T>> {
    return this.fetchApi<T>(
      endpoint,
      {
        ...options,
        method: "PATCH",
        body: JSON.stringify(body),
      },
      withoutAuthHeader,
    );
  }

  public static async put<T>(
    endpoint: string,
    body: unknown,
    options: RequestInit = {},
    withoutAuthHeader?: boolean,
  ): Promise<ApiResponse<T>> {
    return this.fetchApi<T>(
      endpoint,
      {
        ...options,
        method: "PUT",
        body: JSON.stringify(body),
      },
      withoutAuthHeader,
    );
  }

  public static async delete<T>(
    endpoint: string,
    options: RequestInit = {},
    withoutAuthHeader?: boolean,
  ): Promise<ApiResponse<T>> {
    return this.fetchApi<T>(
      endpoint,
      { ...options, method: "DELETE" },
      withoutAuthHeader,
    );
  }
}
