"use client";

import { BadgeCheck, Bell, ChevronsUpDown, LogOut } from "lucide-react";

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

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const { isMobile } = useSidebar();
  const lang = useCurrentLang();
  const direction = getDirection(lang);
  const isRTL = direction === "rtl";

  return (
    <SidebarMenu dir={direction}>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground ltr:text-left rtl:flex-row-reverse rtl:text-right"
            >
              <Avatar className="h-8 w-8 shrink-0 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid min-w-0 flex-1 text-sm leading-tight ltr:text-left rtl:text-right">
                <span className="truncate text-xs font-medium sm:text-sm">
                  {user.name}
                </span>
                <span className="truncate text-xs opacity-70">
                  {user.email}
                </span>
              </div>
              <ChevronsUpDown className="size-4 shrink-0" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg ltr:text-left rtl:text-right"
            side={isMobile ? "bottom" : isRTL ? "left" : "right"}
            align={
              isMobile ? (isRTL ? "start" : "end") : isRTL ? "end" : "start"
            }
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div
                className={`flex items-center gap-2 px-1 py-1.5 text-sm ltr:flex-row ltr:text-left rtl:flex-row-reverse rtl:text-right`}
              >
                <Avatar className="h-8 w-8 shrink-0 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div
                  className={`grid min-w-0 flex-1 text-sm leading-tight ltr:text-left rtl:text-right`}
                >
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs opacity-70">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="gap-2 ltr:flex-row rtl:flex-row-reverse">
                <BadgeCheck className="h-4 w-4 shrink-0" />
                <span className="text-sm">Profile</span>
              </DropdownMenuItem>

              <DropdownMenuItem className="gap-2 ltr:flex-row rtl:flex-row-reverse">
                <Bell className="h-4 w-4 shrink-0" />
                <span className="text-sm">Notifications</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 ltr:flex-row rtl:flex-row-reverse">
              <LogOut className="h-4 w-4 shrink-0" />
              <span className="text-sm">Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
