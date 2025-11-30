"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, ChevronLeft, Home } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "@/components/ui/breadcrumb";
import { useCurrentLang } from "@/hooks/useCurrentLang";
import { getDirection } from "@/utils/translations/language-utils";
import { cn } from "@/lib/utils";

// Default route labels mapping
const DEFAULT_ROUTE_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  students: "Students",
  teachers: "Teachers",
  administration: "Administration",
  libraries: "Libraries",
  subjects: "Subjects",
  lessons: "Lessons",
  units: "Units",
  quizzes: "Quizzes",
  users: "Users",
  settings: "Settings",
  profile: "Profile",
  "ai-assistant": "AI Assistant",
  about: "About",
};

export type BreadcrumbItemType = {
  label: string;
  href?: string;
  icon?: React.ReactNode;
};

type BreadcrumbsProps = { 
  items?: BreadcrumbItemType[]; 
  homeLabel?: string; 
  showHomeIcon?: boolean; 
  maxMobileItems?: number; 
  maxDesktopItems?: number; 
  separator?: React.ReactNode; 
  className?: string; 
  routeLabels?: Record<string, string>;
};

 
export function Breadcrumbs({
  items: customItems,
  homeLabel = "Home",
  showHomeIcon = true,
  maxMobileItems = 2,
  maxDesktopItems = 5,
  separator,
  className,
  routeLabels = {},
}: BreadcrumbsProps) {
  const pathname = usePathname();
  const lang = useCurrentLang();
  const direction = getDirection(lang);
  const isRTL = direction === "rtl";

  // Generate breadcrumbs from pathname if custom items not provided
  const breadcrumbItems = React.useMemo(() => {
    if (customItems) {
      return customItems;
    }

    // Remove language prefix from pathname
    const pathWithoutLang = pathname.replace(`/${lang}`, "") || "/";
    const segments = pathWithoutLang.split("/").filter(Boolean);

    const items: BreadcrumbItemType[] = [
      {
        label: homeLabel,
        href: `/${lang}`,
        icon: showHomeIcon ? <Home className="h-4 w-4" /> : undefined,
      },
    ];

    // Build breadcrumb items from segments
    let currentPath = `/${lang}`;
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === segments.length - 1;

      // Get label priority: custom routeLabels > default labels > capitalized segment
      // Note: Translations can be added via routeLabels prop
      let label = routeLabels[segment];

      if (!label && DEFAULT_ROUTE_LABELS[segment]) {
        label = DEFAULT_ROUTE_LABELS[segment];
      }

      if (!label) {
        // Capitalize segment as fallback
        label = segment
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      }

      items.push({
        label,
        href: isLast ? undefined : currentPath,
      });
    });

    return items;
  }, [customItems, pathname, lang, homeLabel, showHomeIcon, routeLabels]);

  // Responsive: Show fewer items on mobile
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const maxItems = isMobile ? maxMobileItems : maxDesktopItems;
  const shouldTruncate = breadcrumbItems.length > maxItems;

  // Determine which items to show
  const visibleItems = React.useMemo(() => {
    if (!shouldTruncate) {
      return breadcrumbItems;
    }

    // Always show first (home) and last (current page)
    const first = breadcrumbItems[0];
    const last = breadcrumbItems[breadcrumbItems.length - 1];
    const middle = breadcrumbItems.slice(1, -1);

    // Show some middle items if space allows
    const middleToShow = Math.max(0, maxItems - 2);
    const startMiddle = Math.max(0, middle.length - middleToShow);

    return [
      first,
      ...(middleToShow > 0 ? middle.slice(startMiddle) : []),
      last,
    ];
  }, [breadcrumbItems, maxItems, shouldTruncate]);

  const SeparatorIcon = isRTL ? ChevronLeft : ChevronRight;

  return (
    <Breadcrumb
      className={cn("w-full", className)}
      dir={direction}
      aria-label="Breadcrumb navigation"
    >
      <BreadcrumbList
        className={cn(
          "flex-wrap items-center gap-1.5 sm:gap-2.5",
          isRTL && "rtl:flex-row-reverse",
        )}
      >
        {visibleItems.map((item, index) => {
          const isLast = index === visibleItems.length - 1;
          const isFirst = index === 0;
          const showEllipsisBefore =
            shouldTruncate && index === 1 && breadcrumbItems.length > maxItems;

          return (
            <React.Fragment key={`${item.label}-${index}`}>
              {showEllipsisBefore && (
                <>
                  <BreadcrumbItem>
                    <BreadcrumbEllipsis />
                  </BreadcrumbItem>
                  <BreadcrumbSeparator>
                    <SeparatorIcon className="h-3.5 w-3.5" />
                  </BreadcrumbSeparator>
                </>
              )}

              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="text-foreground flex items-center gap-1.5 font-medium">
                    {item.icon && (
                      <span className="flex-shrink-0">{item.icon}</span>
                    )}
                    <span className="truncate">{item.label}</span>
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link
                      href={item.href || "#"}
                      className={cn(
                        "hover:text-foreground flex items-center gap-1.5 transition-colors",
                        isFirst && "text-muted-foreground",
                        !isFirst && "text-muted-foreground/70",
                      )}
                    >
                      {item.icon && (
                        <span className="flex-shrink-0">{item.icon}</span>
                      )}
                      <span className="truncate">{item.label}</span>
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>

              {!isLast && (
                <BreadcrumbSeparator>
                  {separator || (
                    <SeparatorIcon className="text-muted-foreground/50 h-3.5 w-3.5" />
                  )}
                </BreadcrumbSeparator>
              )}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
