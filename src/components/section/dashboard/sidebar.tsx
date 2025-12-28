/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { data } from "@/constants/constants";
import { NavUser } from "@/components/ui/nav-user";
import Image from "next/image";
import { NavMain } from "../../ui/nav-main";
import { useCurrentLang } from "@/hooks/useCurrentLang";
import { getDirection } from "@/utils/translations/language-utils";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const lang = useCurrentLang();
  const direction = getDirection(lang);
  const isRTL = direction === "rtl";
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar
      collapsible="icon"
      side={isRTL ? "right" : "left"}
      dir={direction}
      className="relative ltr:border-r rtl:border-l"
    >
      <SidebarHeader className="flex flex-row items-center justify-center gap-2 p-4 sm:p-2">
        <Image
          src="/images/logo-light.png"
          alt="logo"
          width={35}
          height={35}
          className="shrink-0"
        />
        {!isCollapsed && (
          <p className="from-primary to-primary/70 relative z-10 mt-1 bg-gradient-to-br bg-clip-text text-3xl font-bold text-transparent">
            Quizy
          </p>
        )}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <div className="absolute end-[-26px] top-1/2 flex w-fit -translate-y-1/2 items-center justify-center py-2">
        <SidebarTrigger className="size-8 rounded-full ltr:rotate-180" />
      </div>
      <SidebarFooter className="border-t ltr:border-r-0 ltr:border-l-0 rtl:border-r-0 rtl:border-l-0">
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
