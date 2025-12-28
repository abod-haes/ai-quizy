export interface RegisterRequest {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  role: number;
  countryCallingCode: string;
}

export interface RegisterResponse {
  message: string;
  isAuthenticated: boolean;
  requiresVerification: boolean;
  userId: string;
  token: string;
  phoneNumber: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface VerifyCodeRequest {
  phoneNumber: string;
  otpCode: string;
}

export interface VerifyCodeResponse {
  message: string;
  isAuthenticated: boolean;
  token: string;
  userId: string;
  phoneNumber: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface LoginRequest {
  phoneNumber: string;
  password: string;
  countryCallingCode: string;
}

export interface LoginResponse {
  message: string;
  isAuthenticated: boolean;
  requiresVerification: boolean;
  userId: string;
  token: string;
  phoneNumber: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

