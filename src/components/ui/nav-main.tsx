"use client";

import { ChevronRight, ChevronLeft } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useCurrentLang } from "@/hooks/useCurrentLang";
import { getDirection } from "@/utils/translations/language-utils";
import { useLocalizedHref } from "@/hooks/useLocalizedHref";
import { useTranslation } from "@/providers/TranslationsProvider";
import { useSubjectBriefs } from "@/hooks/api/subjects.query";
import { dashboardRoutesName } from "@/utils/constant";
import { Loading } from "@/components/custom/loading";
import type { NavMainItem } from "@/constants/constants";
import type { TRouteName } from "@/utils/constant";
import { useActiveLink } from "@/components/base/header/useActiveLink";
import { usePathname, useSearchParams } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export function NavMain({ items }: { items: NavMainItem[] }) {
  const lang = useCurrentLang();
  const direction = getDirection(lang);
  const isRTL = direction === "rtl";
  const getLocalizedHref = useLocalizedHref();
  const { sidebar: sidebarDict } = useTranslation();
  const { data: subjects, isLoading: isLoadingSubjects } = useSubjectBriefs();
  const { isLinkActive } = useActiveLink();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { state: sidebarState } = useSidebar();
  const isCollapsed = sidebarState === "collapsed";

  // Map English titles to translation keys
  const getTranslatedTitle = (title: string): string => {
    const titleMap: Record<string, keyof typeof sidebarDict> = {
      Classes: "classes",
      Subjects: "subjects",
      Lessons: "lessons",
      Units: "units",
      Questions: "questions",
      Quizzes: "quizzes",
      Users: "users",
      Mathematics: "mathematics",
      Physics: "physics",
      Chemistry: "chemistry",
      "Computer Science": "computerScience",
      Students: "students",
      Teachers: "teachers",
      Administration: "administration",
    };
    const key = titleMap[title];
    return key ? sidebarDict[key] : title;
  };

  const getTranslatedSubTitle = (title: string): string => {
    const titleMap: Record<string, keyof typeof sidebarDict> = {
      Mathematics: "mathematics",
      Physics: "physics",
      Chemistry: "chemistry",
      "Computer Science": "computerScience",
      Students: "students",
      Teachers: "teachers",
      Administration: "administration",
    };
    const key = titleMap[title];
    return key ? sidebarDict[key] : title;
  };

  // Check if a sub-item URL is active (handles query params for subjects)
  const isSubItemActive = (url: TRouteName): boolean => {
    // For subject URLs with query params, check if pathname matches and query param exists
    if (typeof url === "string" && url.includes("?subjectId=")) {
      const [path, query] = url.split("?");
      const normalizedPath = path.replace(/\/$/, "");
      const normalizedPathname = pathname.replace(/\/$/, "");

      if (normalizedPathname.startsWith(normalizedPath)) {
        const subjectId = searchParams.get("subjectId");
        if (subjectId) {
          const urlSubjectId = query.split("subjectId=")[1];
          return subjectId === urlSubjectId;
        }
      }
      return false;
    }

    // For regular URLs, use the active link hook
    return isLinkActive(url);
  };

  // Check if any child item is active (to keep collapsible open)
  const hasActiveChild = (items: NavMainItem["items"]): boolean => {
    if (!items) return false;
    return items.some((item) => {
      if (!item.url) return false;
      return isSubItemActive(item.url);
    });
  };

  // Component for individual nav item with hover menu for children (when collapsed) or collapsible (when expanded)
  function NavItem({
    item,
    dynamicItems,
    isSubjectsItem,
    hasItems,
    hasUrl,
    translatedTitle,
    isItemActive,
    isChildActive,
    isRTL: isRTLProp,
    getLocalizedHref: getLocalizedHrefProp,
    isLoadingSubjects,
    getTranslatedSubTitle,
    isSubItemActive,
    isCollapsed: isCollapsedProp,
  }: {
    item: NavMainItem;
    dynamicItems: NavMainItem["items"];
    isSubjectsItem: boolean;
    hasItems: boolean;
    hasUrl: boolean;
    translatedTitle: string;
    isItemActive: boolean;
    isChildActive: boolean;
    isRTL: boolean;
    getLocalizedHref: ReturnType<typeof useLocalizedHref>;
    isLoadingSubjects: boolean;
    getTranslatedSubTitle: (title: string) => string;
    isSubItemActive: (url: TRouteName) => boolean;
    isCollapsed: boolean;
  }) {
    const [isHovered, setIsHovered] = useState(false);
    const [isOpen, setIsOpen] = useState(isChildActive);
    const menuRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);

    // Update open state when child becomes active (for collapsible mode)
    useEffect(() => {
      if (isChildActive && !isCollapsedProp) {
        setIsOpen(true);
      }
    }, [isChildActive, isCollapsedProp]);

    // Handle hover menu positioning (only when collapsed)
    useEffect(() => {
      if (
        isHovered &&
        hasItems &&
        isCollapsedProp &&
        menuRef.current &&
        triggerRef.current
      ) {
        const triggerRect = triggerRef.current.getBoundingClientRect();
        const menu = menuRef.current;
        const viewportHeight = window.innerHeight;

        // Use requestAnimationFrame to ensure menu is rendered before measuring
        requestAnimationFrame(() => {
          const menuRect = menu.getBoundingClientRect();

          if (isRTLProp) {
            // RTL: position menu to the left of the sidebar
            const rightPosition = window.innerWidth - triggerRect.left;
            menu.style.right = `${rightPosition}px`;

            // Adjust top if menu would go off bottom of screen
            let topPosition = triggerRect.top;
            if (topPosition + menuRect.height > viewportHeight) {
              topPosition = viewportHeight - menuRect.height - 8;
            }
            if (topPosition < 8) {
              topPosition = 8;
            }
            menu.style.top = `${topPosition}px`;
          } else {
            // LTR: position menu to the right of the sidebar
            const leftPosition = triggerRect.right;
            menu.style.left = `${leftPosition}px`;

            // Adjust top if menu would go off bottom of screen
            let topPosition = triggerRect.top;
            if (topPosition + menuRect.height > viewportHeight) {
              topPosition = viewportHeight - menuRect.height - 8;
            }
            if (topPosition < 8) {
              topPosition = 8;
            }
            menu.style.top = `${topPosition}px`;
          }
        });
      }
    }, [isHovered, hasItems, isCollapsedProp, isRTLProp, dynamicItems]);

    // Render children items
    const renderChildren = () => {
      if (isLoadingSubjects && isSubjectsItem) {
        return (
          <div className="flex items-center justify-center px-2 py-1">
            <Loading size="sm" spinnerOnly />
          </div>
        );
      }

      return dynamicItems?.map((subItem, index) => {
        const displayTitle = isSubjectsItem
          ? subItem.title
          : getTranslatedSubTitle(subItem.title);
        const uniqueKey = isSubjectsItem
          ? typeof subItem.url === "string"
            ? subItem.url
            : `subject-${index}`
          : subItem.title;
        const isSubActive = subItem.url ? isSubItemActive(subItem.url) : false;

        return (
          <SidebarMenuSubItem key={uniqueKey}>
            <SidebarMenuSubButton
              asChild
              isActive={isSubActive}
              className={cn(
                "hover:bg-primary/10 hover:text-primary rounded-md px-2 py-1 text-xs transition-colors duration-150 sm:text-sm ltr:text-start rtl:text-right",
                isSubActive && "bg-primary/20 text-primary font-medium",
              )}
            >
              <a
                href={getLocalizedHrefProp(subItem.url)}
                className={cn(
                  "block",
                  isSubActive && "text-primary font-medium",
                )}
              >
                <span>{displayTitle}</span>
              </a>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
        );
      });
    };

    return (
      <SidebarMenuItem
        className={cn(
          "group/menu-item relative",
          !isCollapsedProp && hasItems && "group/collapsible",
        )}
        onMouseEnter={() => hasItems && isCollapsedProp && setIsHovered(true)}
        onMouseLeave={() => isCollapsedProp && setIsHovered(false)}
      >
        {hasUrl && !hasItems ? (
          <SidebarMenuButton
            asChild
            isActive={isItemActive}
            tooltip={translatedTitle}
            className={cn(
              "hover:bg-primary/10 hover:text-primary flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors duration-200 ltr:text-start rtl:flex-row-reverse rtl:text-right",
              isItemActive && "bg-primary/20 text-primary font-medium",
            )}
          >
            <a href={item.url ? getLocalizedHrefProp(item.url) : "#"}>
              {item.icon && (
                <item.icon
                  className={cn(
                    "h-10 w-10 shrink-0 transition-colors duration-200",
                    isItemActive && "text-primary",
                  )}
                />
              )}
              <span
                className={cn(
                  "flex-1 text-sm transition-colors duration-200 sm:text-base",
                  isItemActive && "text-primary font-medium",
                )}
              >
                {translatedTitle}
              </span>
            </a>
          </SidebarMenuButton>
        ) : isCollapsedProp && hasItems ? (
          // Collapsed sidebar: show hover menu
          <>
            <div ref={triggerRef}>
              <SidebarMenuButton
                tooltip={undefined}
                isActive={isItemActive || isChildActive}
                className={cn(
                  "hover:bg-primary/10 group-hover/menu-item:bg-primary/20 group-hover/menu-item:text-primary flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors duration-200 ltr:text-start rtl:flex-row-reverse rtl:text-right",
                  (isItemActive || isChildActive) &&
                    "bg-primary/20 text-primary",
                )}
              >
                {item.icon && (
                  <item.icon
                    className={cn(
                      "group-hover/menu-item:text-primary size-10 h-5 w-5 shrink-0 transition-colors duration-200",
                      (isItemActive || isChildActive) && "text-primary",
                    )}
                  />
                )}
                <span
                  className={cn(
                    "group-hover/menu-item:text-primary flex-1 text-sm transition-colors duration-200 sm:text-base",
                    (isItemActive || isChildActive) && "text-primary",
                  )}
                >
                  {translatedTitle}
                </span>
                {hasItems && (
                  <>
                    {isRTLProp ? (
                      <ChevronLeft className="group-hover/menu-item:text-primary h-4 w-4 shrink-0 transition-colors duration-200" />
                    ) : (
                      <ChevronRight className="group-hover/menu-item:text-primary h-4 w-4 shrink-0 transition-colors duration-200" />
                    )}
                  </>
                )}
              </SidebarMenuButton>
            </div>

            {isHovered && (
              <div
                ref={menuRef}
                className={cn(
                  "bg-background border-border fixed z-50 min-w-[200px] rounded-lg border py-1 shadow-lg",
                  "animate-in fade-in-0 zoom-in-95 duration-200",
                )}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <ul className="flex flex-col gap-0.5">
                  {dynamicItems?.map((subItem, index) => {
                    const displayTitle = isSubjectsItem
                      ? subItem.title
                      : getTranslatedSubTitle(subItem.title);
                    const uniqueKey = isSubjectsItem
                      ? typeof subItem.url === "string"
                        ? subItem.url
                        : `subject-${index}`
                      : subItem.title;
                    const isSubActive = subItem.url
                      ? isSubItemActive(subItem.url)
                      : false;

                    return (
                      <li key={uniqueKey}>
                        <a
                          href={getLocalizedHrefProp(subItem.url)}
                          className={cn(
                            "hover:bg-primary/10 hover:text-primary block rounded-md px-3 py-1.5 text-xs transition-colors duration-150 sm:text-sm",
                            isSubActive &&
                              "bg-primary/20 text-primary font-medium",
                            "text-start",
                          )}
                        >
                          {displayTitle}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </>
        ) : (
          // Expanded sidebar: show collapsible
          <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
            className="group/collapsible"
            disabled={!hasItems}
          >
            <CollapsibleTrigger className="cursor-pointer" asChild>
              <SidebarMenuButton
                tooltip={translatedTitle}
                isActive={isItemActive || isChildActive}
                className={cn(
                  "hover:bg-primary/10 group-hover/collapsible:bg-primary/20 group-hover/collapsible:text-primary group-data-[state=open]/collapsible:bg-primary/20 group-data-[state=open]/collapsible:text-primary flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors duration-200 ltr:text-start rtl:flex-row-reverse rtl:text-right",
                  (isItemActive || isChildActive) &&
                    "bg-primary/20 text-primary font-medium",
                )}
              >
                {item.icon && (
                  <item.icon
                    className={cn(
                      "group-hover/collapsible:text-primary group-data-[state=open]/collapsible:text-primary size-10 h-5 w-5 shrink-0 transition-colors duration-200",
                      (isItemActive || isChildActive) && "text-primary",
                    )}
                  />
                )}
                <span
                  className={cn(
                    "group-hover/collapsible:text-primary flex-1 text-sm transition-colors duration-200 sm:text-base",
                    (isItemActive || isChildActive) && "text-primary",
                  )}
                >
                  {translatedTitle}
                </span>
                {hasItems && (
                  <>
                    {isRTLProp ? (
                      <ChevronLeft className="group-hover/collapsible:text-primary group-data-[state=open]/collapsible:text-primary h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    ) : (
                      <ChevronRight className="group-hover/collapsible:text-primary group-data-[state=open]/collapsible:text-primary h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    )}
                  </>
                )}
              </SidebarMenuButton>
            </CollapsibleTrigger>

            {hasItems && (
              <CollapsibleContent>
                <SidebarMenuSub className="ltr:mr-0 ltr:ml-3.5 ltr:border-l rtl:mr-3.5 rtl:ml-0 rtl:border-r">
                  {renderChildren()}
                </SidebarMenuSub>
              </CollapsibleContent>
            )}
          </Collapsible>
        )}
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarGroup dir={direction}>
      <SidebarGroupLabel className="text-xs font-medium sm:text-sm ltr:text-start rtl:text-right">
        {sidebarDict.dashboardAccess}
      </SidebarGroupLabel>

      <SidebarMenu>
        {items.map((item) => {
          const isSubjectsItem = item.title === "Subjects";
          // Use fetched subjects for Subjects item, otherwise use provided items
          const dynamicItems = isSubjectsItem
            ? subjects?.map((subject) => ({
                title: subject.name,
                url: `${dashboardRoutesName.lessons.href}?subjectId=${subject.id}` as TRouteName,
              }))
            : item.items;

          const hasItems = !!(dynamicItems && dynamicItems.length > 0);
          const hasUrl = item.url !== undefined;
          const translatedTitle = getTranslatedTitle(item.title);

          // Check if current item or any child is active
          const isItemActive = item.url ? isLinkActive(item.url) : false;
          const isChildActive = hasActiveChild(dynamicItems);

          return (
            <NavItem
              key={item.title}
              item={item}
              dynamicItems={dynamicItems}
              isSubjectsItem={isSubjectsItem}
              hasItems={hasItems}
              hasUrl={hasUrl}
              translatedTitle={translatedTitle}
              isItemActive={isItemActive}
              isChildActive={isChildActive}
              isRTL={isRTL}
              getLocalizedHref={getLocalizedHref}
              isLoadingSubjects={isLoadingSubjects}
              getTranslatedSubTitle={getTranslatedSubTitle}
              isSubItemActive={isSubItemActive}
              isCollapsed={isCollapsed}
            />
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
