import { create } from "zustand";
import type { User } from "@/services/user.services/user.type";

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;
  isAuth: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
  isAuth: () => get().user !== null,
}));

export const useUser = () => useAuthStore((state) => state.user);
