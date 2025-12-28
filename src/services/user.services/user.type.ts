import { roleType } from "@/utils/enum/common.enum";

export interface User extends Record<string, unknown> {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: roleType;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  countryCallingCode?: string;
  phoneNumber?: string;
  description?: string;
  url?: string;
}

export interface UserInput {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  countryCallingCode?: string;
  phoneNumber?: string;
  role?: roleType;
  description?: string;
  url?: string;
}
