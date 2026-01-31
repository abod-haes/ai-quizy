import { create } from "zustand";
import type { User } from "@/services/user.services/user.type";
import { deleteCookie, myCookies } from "@/utils/cookies";
import { queryKeys } from "@/utils/query-keys";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import type { QueryClient } from "@tanstack/react-query";

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

/**
 * Unified logout function that properly clears all authentication state
 * This should be used by all logout handlers to ensure consistency
 */
export async function handleLogout(
  router: AppRouterInstance,
  queryClient?: QueryClient,
  getLocalizedHref?: (path: string) => string,
  homePath: string = "/",
) {
  // Clear auth store first
  useAuthStore.getState().clearUser();
  
  // Remove user queries from cache instead of invalidating (to prevent refetch)
  if (queryClient) {
    // Remove current user query from cache
    queryClient.removeQueries({
      queryKey: queryKeys.user.currentUser(),
    });
    // Remove all user-related queries from cache
    queryClient.removeQueries({
      queryKey: ["user"],
    });
  }
  
  // Delete cookies after clearing cache
  await deleteCookie(myCookies.auth);
  await deleteCookie(myCookies.user);
  
  // Refresh router to ensure all components re-render
  router.refresh();
  
  // Navigate to home
  const finalPath = getLocalizedHref ? getLocalizedHref(homePath) : homePath;
  router.push(finalPath);
}
