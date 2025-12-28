"use client";

import { useUser } from "@/store/auth.store";
import { roleType } from "@/utils/enum/common.enum";
import { Loading } from "@/components/custom/loading";

interface RoleRouteGuardProps {
  children: React.ReactNode;
  allowedRoles?: roleType[];
}

/**
 * Component to protect routes based on user role
 * Middleware already handles authentication and role checking,
 * this component just ensures user data is loaded and matches expected role
 */
export function RoleRouteGuard({
  children,
  allowedRoles = [roleType.ADMIN],
}: RoleRouteGuardProps) {
  const user = useUser();

  // Show loading state while user data is being fetched
  // Middleware already checked authentication and role, so we just wait for data
  if (user === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loading size="lg" spinnerOnly />
      </div>
    );
  }

  // If user doesn't exist or doesn't have allowed role, show loading
  // (Middleware should have already redirected, but this is a safety check)
  if (!user || !allowedRoles.includes(user.role)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loading size="lg" spinnerOnly />
      </div>
    );
  }

  // User is authenticated and has correct role (verified by middleware)
  return <>{children}</>;
}
