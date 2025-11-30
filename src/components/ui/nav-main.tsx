"use client";

import { ChevronRight } from "lucide-react";

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
import { useLocalizedHref } from "@/hooks/useLocalizedHref";
import type { NavMainItem } from "@/constants/constants";
import type { TRouteName } from "@/utils/constant";

export function NavMain({ items }: { items: NavMainItem[] }) {
  const lang = useCurrentLang();
  const direction = getDirection(lang);
  const isRTL = direction === "rtl";
  const getLocalizedHref = useLocalizedHref();

  return (
    <SidebarGroup dir={direction}>
      <SidebarGroupLabel className="text-xs font-medium sm:text-sm ltr:text-left rtl:text-right">
        Dashboard Access
      </SidebarGroupLabel>

      <SidebarMenu>
        {items.map((item) => {
          const hasItems = item.items && item.items.length > 0;
          const hasUrl = item.url !== undefined;

          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive}
              className="group/collapsible"
              disabled={!hasItems}
            >
              <SidebarMenuItem>
                {hasUrl && !hasItems ? (
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    className="hover:bg-primary/10 hover:text-primary flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors duration-200 ltr:text-left rtl:flex-row-reverse rtl:text-right"
                  >
                    <a href={item.url ? getLocalizedHref(item.url) : "#"}>
                      {item.icon && (
                        <item.icon className="h-4 w-4 shrink-0 transition-colors duration-200" />
                      )}
                      <span className="flex-1 text-sm transition-colors duration-200 sm:text-base">
                        {item.title}
                      </span>
                    </a>
                  </SidebarMenuButton>
                ) : (
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={item.title}
                      className="hover:bg-primary/10 group-hover/collapsible:bg-primary/20 group-hover/collapsible:text-primary group-data-[state=open]/collapsible:bg-primary/20 group-data-[state=open]/collapsible:text-primary flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors duration-200 ltr:text-left rtl:flex-row-reverse rtl:text-right"
                    >
                      {item.icon && (
                        <item.icon className="group-hover/collapsible:text-primary group-data-[state=open]/collapsible:text-primary h-4 w-4 shrink-0 transition-colors duration-200" />
                      )}

                      <span className="group-hover/collapsible:text-primary flex-1 text-sm transition-colors duration-200 sm:text-base">
                        {item.title}
                      </span>

                      {hasItems && (
                        <ChevronRight
                          className={`group-hover/collapsible:text-primary group-data-[state=open]/collapsible:text-primary h-4 w-4 shrink-0 transition-transform duration-200 ${
                            isRTL
                              ? "group-data-[state=open]/collapsible:rotate-90 rtl:scale-x-[-1]"
                              : "group-data-[state=open]/collapsible:rotate-90"
                          }`}
                        />
                      )}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                )}

                {hasItems && (
                  <CollapsibleContent>
                    <SidebarMenuSub className="ltr:mr-0 ltr:ml-3.5 ltr:border-l rtl:mr-3.5 rtl:ml-0 rtl:border-r">
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            className="hover:bg-primary/10 hover:text-primary rounded-md px-2 py-1 text-xs transition-colors duration-150 sm:text-sm ltr:text-left rtl:text-right"
                          >
                            <a
                              href={
                                typeof subItem.url === "string"
                                  ? subItem.url.startsWith("/")
                                    ? getLocalizedHref(
                                        subItem.url as TRouteName,
                                      )
                                    : subItem.url
                                  : "#"
                              }
                              className="block"
                            >
                              <span>{subItem.title}</span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                )}
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
