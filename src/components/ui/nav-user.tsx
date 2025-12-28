"use client";

import { BadgeCheck, Home, ChevronsUpDown, LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useCurrentLang } from "@/hooks/useCurrentLang";
import { getDirection } from "@/utils/translations/language-utils";
import { useUser, useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { useLocalizedHref } from "@/hooks/useLocalizedHref";
import { routesName } from "@/utils/constant";
import { deleteCookie, myCookies } from "@/utils/cookies";
import { useTranslation } from "@/providers/TranslationsProvider";

export function NavUser() {
  const { isMobile } = useSidebar();
  const lang = useCurrentLang();
  const direction = getDirection(lang);
  const isRTL = direction === "rtl";
  const user = useUser();
  const router = useRouter();
  const getLocalizedHref = useLocalizedHref();
  const clearUser = useAuthStore((state) => state.clearUser);
  const { header } = useTranslation();

  // Get user data or use fallback
  const userName = user
    ? `${user.firstName} ${user.lastName}`.trim() || user.email
    : "User";
  const userEmail = user?.email || "";
  const userAvatar = user?.avatar || "";
  const userInitials = user
    ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() ||
      user.email?.[0]?.toUpperCase() ||
      "U"
    : "U";

  const handleLogout = async () => {
    await deleteCookie(myCookies.auth);
    await deleteCookie(myCookies.user);
    clearUser();
    router.push(getLocalizedHref(routesName.home.href));
  };

  return (
    <SidebarMenu dir={direction}>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground ltr:text-start rtl:flex-row-reverse rtl:text-start"
            >
              <Avatar className="h-8 w-8 shrink-0 rounded-lg">
                <AvatarImage src={userAvatar} alt={userName} />
                <AvatarFallback className="rounded-lg">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="grid min-w-0 flex-1 text-sm leading-tight ltr:text-start rtl:text-start">
                <span className="truncate text-xs font-medium sm:text-sm">
                  {userName}
                </span>
                <span className="truncate text-xs opacity-70">{userEmail}</span>
              </div>
              <ChevronsUpDown className="size-4 shrink-0" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="bg-background w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg ltr:text-start rtl:text-start"
            side={isMobile ? "bottom" : isRTL ? "left" : "right"}
            align={
              isMobile ? (isRTL ? "start" : "end") : isRTL ? "end" : "start"
            }
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div
                className={`flex items-center gap-2 px-1 py-1.5 text-sm ltr:flex-row ltr:text-start rtl:flex-row-reverse rtl:text-start`}
              >
                <Avatar className="h-8 w-8 shrink-0 rounded-lg">
                  <AvatarImage src={userAvatar} alt={userName} />
                  <AvatarFallback className="rounded-lg">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`grid min-w-0 flex-1 text-sm leading-tight ltr:text-start rtl:text-start`}
                >
                  <span className="truncate font-medium">{userName}</span>
                  <span className="truncate text-xs opacity-70">
                    {userEmail}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="cursor-pointer gap-2 ltr:flex-row rtl:flex-row-reverse"
                onClick={() =>
                  router.push(getLocalizedHref(routesName.home.href))
                }
              >
                <Home className="h-4 w-4 shrink-0" />
                <span className="text-sm">
                  {header.userMenu.home || "Home"}
                </span>
              </DropdownMenuItem>

              <DropdownMenuItem
                className="cursor-pointer gap-2 ltr:flex-row rtl:flex-row-reverse"
                onClick={() =>
                  router.push(getLocalizedHref(routesName.profile.href))
                }
              >
                <BadgeCheck className="h-4 w-4 shrink-0" />
                <span className="text-sm">
                  {header.userMenu?.profile || "Profile"}
                </span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive cursor-pointer gap-2 ltr:flex-row rtl:flex-row-reverse"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 shrink-0" />
              <span className="text-sm">
                {header.userMenu?.logout || "Log out"}
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
