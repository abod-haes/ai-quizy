"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useCurrentLang } from "@/hooks/useCurrentLang";
import { getDirection } from "@/utils/translations/language-utils";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const lang = useCurrentLang();
  const direction = getDirection(lang);
  const isRTL = direction === "rtl";

  return (
    <SidebarGroup dir={direction}>
      <SidebarGroupLabel className="text-xs sm:text-sm ltr:text-left rtl:text-right">
        Dashboard Access
      </SidebarGroupLabel>

      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  tooltip={item.title}
                  className={`hover:bg-primary/10 group-hover/collapsible:bg-primary/20 group-hover/collapsible:text-primary group-data-[state=open]/collapsible:bg-primary/20 group-data-[state=open]/collapsible:text-primary flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors duration-200 ltr:text-left rtl:flex-row-reverse rtl:text-right`}
                >
                  {item.icon && (
                    <item.icon className="group-hover/collapsible:text-primary group-data-[state=open]/collapsible:text-primary h-4 w-4 shrink-0 transition-colors duration-200" />
                  )}

                  <span className="group-hover/collapsible:text-primary flex-1 text-sm transition-colors duration-200 sm:text-base">
                    {item.title}
                  </span>

                  <ChevronRight
                    className={`group-hover/collapsible:text-primary group-data-[state=open]/collapsible:text-primary h-4 w-4 shrink-0 transition-transform duration-200 ${
                      isRTL
                        ? "group-data-[state=open]/collapsible:rotate-90 rtl:scale-x-[-1]"
                        : "group-data-[state=open]/collapsible:rotate-90"
                    }`}
                  />
                </SidebarMenuButton>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <SidebarMenuSub className="ltr:mr-0 ltr:ml-3.5 ltr:border-l rtl:mr-3.5 rtl:ml-0 rtl:border-r">
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton
                        asChild
                        className="hover:bg-primary/10 hover:text-primary rounded-md px-2 py-1 text-xs transition-colors duration-150 sm:text-sm ltr:text-left rtl:text-right"
                      >
                        <a
                          href={subItem.url}
                          className="hover:bg-primary/10 hover:text-primary block rounded-md px-2 py-1 text-xs transition-colors duration-150 sm:text-sm ltr:text-left rtl:text-right"
                        >
                          <span>{subItem.title}</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
