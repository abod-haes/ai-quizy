import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { toast } from "sonner";
import { deleteCookie, getAuthHeader, myCookies } from "@/utils/cookies";
import type { ApiError } from "@/types/common.type";

const MUTATION_METHODS: HttpMethod[] = ["POST", "PUT", "PATCH", "DELETE"];
type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  statusCode?: number;
  timestamp?: string;
}

const extractErrorMessage = (error: AxiosError<ApiError>): string => {
  const data = error.response?.data;
  if (!data) return "An unexpected error occurred";

  // Build error message with title and detail only
  const parts: string[] = [];
  
  if (data.title) {
    parts.push(data.title);
  }
  
  if (data.detail) {
    parts.push(data.detail);
  }

  // If we have both title and detail, join them
  if (parts.length > 0) {
    return parts.join(" - ");
  }

  // Fallback to default message
  return "An unexpected error occurred";
};

const extractSuccessMessage = (
  response: AxiosResponse<ApiResponse>,
): string | null => {
  return response.data.message || null;
};

const handleUnauthorized = async (): Promise<void> => {
  if (typeof document !== "undefined") {
    await deleteCookie(myCookies.auth);
    await deleteCookie(myCookies.user);
    window.location.href = "/sign-in";
  }
};

// const getCurrentLanguage = (): string => {
//   if (typeof window === "undefined") return "en";
//   return window.location.pathname.startsWith("/ar") ? "ar" : "en";
// };

const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL + "/api",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Requested-With": "XMLHttpRequest",
    },
  });

  instance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      //   config.headers["Accept-Language"] = getCurrentLanguage();

      try {
        const authHeader = await getAuthHeader();
        Object.assign(config.headers, authHeader);
      } catch {}

      //   if (typeof window === "undefined") {
      //     config.headers["Cache-Control"] = "no-store";
      //   }

      return config;
    },
    (error: AxiosError) => Promise.reject(error),
  );

  instance.interceptors.response.use(
    (response: AxiosResponse<ApiResponse>) => {
      const method = response.config.method?.toUpperCase() as HttpMethod;

      if (method && MUTATION_METHODS.includes(method)) {
        const successMessage = extractSuccessMessage(response);
        if (successMessage) {
          toast.success(successMessage);
        }
      }

      return response;
    },
    async (error: AxiosError<ApiError>) => {
      const status = error.response?.status;

      if (status === 401) {
        await handleUnauthorized();
        toast.error("You have been logged out. Please sign in again.");
      } else {
        const errorMessage = extractErrorMessage(error);
        toast.error(errorMessage);
      }

      return Promise.reject(error);
    },
  );

  return instance;
};

export const api = createAxiosInstance();
