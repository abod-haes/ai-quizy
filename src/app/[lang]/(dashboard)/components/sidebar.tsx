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
import { NavMain } from "../../../../components/ui/nav-main";
import { NavProjects } from "../../../../components/ui/side-projects";
import { NavUser } from "@/components/ui/nav-user";
import Image from "next/image";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Image
          src="/images/logo-light.png"
          alt="logo"
          width={35}
          height={35}
        />{" "}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
