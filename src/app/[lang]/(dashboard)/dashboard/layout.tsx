"use client";
import "@/styles/globals.css";

import {
  SidebarInset,
  SidebarProvider,
  useSidebar,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/section/dashboard/sidebar";
import { RoleRouteGuard } from "@/components/auth/role-route-guard";
import { roleType } from "@/utils/enum/common.enum";

function MobileBackdrop() {
  const { isMobile, openMobile, setOpenMobile } = useSidebar();

  if (!isMobile || !openMobile) return null;

  return (
    <div
      className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-200 md:hidden"
      onClick={() => setOpenMobile(false)}
      aria-hidden="true"
    />
  );
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full">
      <AppSidebar />
      <MobileBackdrop />
      <SidebarInset className="w-full overflow-auto">
        <div className="h-screen overflow-auto px-8 py-6">{children}</div>
      </SidebarInset>
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleRouteGuard allowedRoles={[roleType.ADMIN]}>
      <SidebarProvider>
        <LayoutContent>{children}</LayoutContent>
      </SidebarProvider>
    </RoleRouteGuard>
  );
}
