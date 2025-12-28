"use client";

import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import {
  RegisterRequest,
  RegisterResponse,
  VerifyCodeRequest,
  VerifyCodeResponse,
  LoginRequest,
  LoginResponse,
} from "@/types/auth.type";
import { queryKeys } from "@/utils/query-keys";

export function useRegister() {
  return useMutation<RegisterResponse, Error, RegisterRequest>({
    mutationKey: queryKeys.auth.register(),
    mutationFn: (data: RegisterRequest) => authService.register(data),
  });
}

export function useVerifyCode() {
  return useMutation<VerifyCodeResponse, Error, VerifyCodeRequest>({
    mutationKey: queryKeys.auth.verifyCode(),
    mutationFn: (data: VerifyCodeRequest) => authService.verifyCode(data),
  });
}

export function useLogin() {
  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationKey: queryKeys.auth.login(),
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: () => {},
  });
}
