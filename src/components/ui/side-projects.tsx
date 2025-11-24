"use client";

import {
  Folder,
  Forward,
  MoreHorizontal,
  Trash2,
  type LucideIcon,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useCurrentLang } from "@/hooks/useCurrentLang";
import { getDirection } from "@/utils/translations/language-utils";

export function NavProjects({
  projects,
}: {
  projects: {
    name: string;
    url: string;
    icon: LucideIcon;
  }[];
}) {
  const { isMobile } = useSidebar();
  const lang = useCurrentLang();
  const direction = getDirection(lang);
  const isRTL = direction === "rtl";

  return (
    <SidebarGroup
      className="group-data-[collapsible=icon]:hidden"
      dir={direction}
    >
      <SidebarGroupLabel className="text-xs sm:text-sm ltr:text-left rtl:text-right">
        Projects
      </SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton
              className={`hover:bg-primary/10 group-hover/collapsible:bg-primary/20 group-hover/collapsible:text-primary group-data-[state=open]/collapsible:bg-primary/20 group-data-[state=open]/collapsible:text-primary flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors duration-200 ltr:text-left rtl:flex-row-reverse rtl:text-right`}
              asChild
            >
              <a
                href={item.url}
                className="flex items-center gap-2 rtl:flex-row-reverse"
              >
                <item.icon className="h-4 w-4 shrink-0" />
                <span className="flex-1 text-sm sm:text-base">{item.name}</span>
              </a>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction
                  showOnHover
                  className={`${isRTL ? "right-auto left-1" : "right-1 left-auto"}`}
                >
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 rounded-lg ltr:text-left rtl:text-right"
                side={isMobile ? "bottom" : isRTL ? "left" : "right"}
                align={
                  isMobile ? (isRTL ? "start" : "end") : isRTL ? "end" : "start"
                }
              >
                <DropdownMenuItem className="hover:bg-primary/15 hover:text-primary gap-2 ltr:flex-row rtl:flex-row-reverse">
                  <Folder className="text-muted-foreground h-4 w-4 shrink-0" />
                  <span className="text-sm">View Project</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-primary/15 hover:text-primary gap-2 ltr:flex-row rtl:flex-row-reverse">
                  <Forward className="text-muted-foreground h-4 w-4 shrink-0" />
                  <span className="text-sm">Share Project</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="hover:bg-primary/15 hover:text-primary gap-2 ltr:flex-row rtl:flex-row-reverse">
                  <Trash2 className="text-muted-foreground h-4 w-4 shrink-0" />
                  <span className="text-sm">Delete Project</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
          <SidebarMenuButton
            className={`hover:bg-primary/10 group-hover/collapsible:bg-primary/20 group-hover/collapsible:text-primary group-data-[state=open]/collapsible:bg-primary/20 group-data-[state=open]/collapsible:text-primary flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors duration-200 ltr:text-left rtl:flex-row-reverse rtl:text-right`}
          >
            <MoreHorizontal className="text-sidebar-foreground/70 h-4 w-4 shrink-0" />
            <span className="text-sm sm:text-base">More</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
