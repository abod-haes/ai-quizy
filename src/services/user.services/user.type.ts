 
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: "admin" | "user" | "moderator";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
 
export type UserInput = Partial<Omit<User, "id" | "createdAt" | "updatedAt">>;
