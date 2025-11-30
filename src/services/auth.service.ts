import axios from "axios";
import {
  RegisterRequest,
  RegisterResponse,
  VerifyCodeRequest,
  VerifyCodeResponse,
  LoginRequest,
  LoginResponse,
} from "@/types/auth.type";
import { END_POINTS } from "@/utils/query-apis";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Create a separate axios instance for auth endpoints (without auth header)
const authApi = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const authService = {
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await authApi.post<RegisterResponse>(
      END_POINTS.AUTH.REGISTER,
      data,
    );
    return response.data;
  },

  async verifyCode(data: VerifyCodeRequest): Promise<VerifyCodeResponse> {
    const response = await authApi.post<VerifyCodeResponse>(
      END_POINTS.AUTH.VERIFY_CODE,
      data,
    );
    return response.data;
  },

  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await authApi.post<LoginResponse>(
      END_POINTS.AUTH.LOGIN,
      data,
    );
    return response.data;
  },
};
