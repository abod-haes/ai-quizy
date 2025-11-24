/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { data } from "@/constants/constants";
import { NavUser } from "@/components/ui/nav-user";
import Image from "next/image";
import { NavMain } from "../../ui/nav-main";
import { NavProjects } from "../../ui/side-projects";
import { useCurrentLang } from "@/hooks/useCurrentLang";
import { getDirection } from "@/utils/translations/language-utils";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const lang = useCurrentLang();
  const direction = getDirection(lang);
  const isRTL = direction === "rtl";

  return (
    <Sidebar
      collapsible="icon"
      side={isRTL ? "right" : "left"}
      dir={direction}
      className="ltr:border-r rtl:border-l"
    >
      <SidebarHeader className="flex items-center justify-center gap-2 p-4 sm:p-2 rtl:flex-row-reverse">
        <Image
          src="/images/logo-light.png"
          alt="logo"
          width={35}
          height={35}
          className="shrink-0"
        />
      </SidebarHeader>
      <SidebarContent className="overflow-y-auto">
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter className="border-t ltr:border-r-0 ltr:border-l-0 rtl:border-r-0 rtl:border-l-0">
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
