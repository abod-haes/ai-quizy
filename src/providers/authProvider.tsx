"use client";

import React, { useEffect } from "react";
import { useCurrentUser } from "@/services/user.services/user.query";
import { useAuthStore } from "@/store/auth.store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: currentUser } = useCurrentUser();
  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearUser);

  useEffect(() => {
    if (currentUser) {
      setUser(currentUser);
    }
  }, [currentUser, setUser, clearUser]);

  return <>{children}</>;
}
