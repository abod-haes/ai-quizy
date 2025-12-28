"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "@/services/user.services/user.query";
import { useAuthStore } from "@/store/auth.store";
import { queryKeys } from "@/utils/query-keys";
import { readCookieFromDocument, myCookies, setCookie, deleteCookie } from "@/utils/cookies";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const token = readCookieFromDocument(myCookies.auth);
  const { data: currentUser, isLoading } = useCurrentUser();
  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearUser);

  // Invalidate user query when route changes (to refresh user data)
  useEffect(() => {
    if (token) {
      queryClient.invalidateQueries({
        queryKey: queryKeys.user.currentUser(),
      });
    }
  }, [pathname, queryClient, token]);

  // Update Zustand store and cookies when user data changes
  useEffect(() => {
    if (currentUser) {
      setUser(currentUser);
      // Store user data in cookie for middleware access
      setCookie(myCookies.user, JSON.stringify(currentUser));
    } else if (!isLoading && !token) {
      // Clear user if no token and not loading
      clearUser();
      // Remove user cookie
      deleteCookie(myCookies.user);
    }
  }, [currentUser, setUser, clearUser, isLoading, token]);

  return <>{children}</>;
}
