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
import { routesName, dashboardRoutesName } from "@/utils/constant";
import { useTranslation } from "@/providers/TranslationsProvider";

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
};

/**
 * Gets translation value from nested key path
 */
function getNestedTranslation(
  translations: unknown,
  keyPath: string,
): string | null {
  const keys = keyPath.split(".");
  let current: unknown = translations;

  for (const key of keys) {
    if (
      current &&
      typeof current === "object" &&
      key in current &&
      current !== null
    ) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return null;
    }
  }

  return typeof current === "string" ? current : null;
}

/**
 * Capitalizes a segment for fallback labels
 */
function capitalizeSegment(segment: string): string {
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Creates a route map for efficient lookups
 * Returns a map of route paths to keyNames, and a separate map for dynamic routes
 */
function createRouteMap(
  routes: typeof routesName | typeof dashboardRoutesName,
): {
  staticRoutes: Map<string, string>;
  dynamicRoutes: Array<{ pattern: RegExp; keyName: string; basePath: string }>;
} {
  const staticRoutes = new Map<string, string>();
  const dynamicRoutes: Array<{
    pattern: RegExp;
    keyName: string;
    basePath: string;
  }> = [];

  for (const route of Object.values(routes)) {
    if (typeof route === "object" && route !== null && "href" in route) {
      const href = route.href;
      // Check if it's a dynamic route (contains :id or similar)
      if (href.includes(":id") || href.includes(":")) {
        // Create a regex pattern for dynamic routes
        const basePath = href.split(":")[0].replace(/\/$/, ""); // Remove trailing slash
        const pattern = new RegExp(
          `^${href.replace(":id", "[^/]+").replace(":", "[^/]+")}$`,
        );
        dynamicRoutes.push({ pattern, keyName: route.keyName, basePath });
      } else {
        staticRoutes.set(href, route.keyName);
      }
    }
  }

  // Sort dynamic routes by specificity (longer base paths first)
  dynamicRoutes.sort((a, b) => b.basePath.length - a.basePath.length);

  return { staticRoutes, dynamicRoutes };
}

/**
 * Finds the best matching route for a given path
 */
function findRouteLabel(
  path: string,
  routeMaps: {
    staticRoutes: Map<string, string>;
    dynamicRoutes: Array<{
      pattern: RegExp;
      keyName: string;
      basePath: string;
    }>;
  },
  getTranslation: (keyName: string) => string | null,
): string | null {
  // Try exact match first (static routes)
  const exactKeyName = routeMaps.staticRoutes.get(path);
  if (exactKeyName) {
    return getTranslation(exactKeyName);
  }

  // Try dynamic routes (check more specific routes first)
  for (const { pattern, keyName, basePath } of routeMaps.dynamicRoutes) {
    if (path.startsWith(basePath) && pattern.test(path)) {
      const translation = getTranslation(keyName);
      if (translation) {
        return translation;
      }
    }
  }

  // Try prefix match for static routes (for nested routes like /dashboard/students/123)
  // But only if no dynamic route matched
  for (const [routePath, keyName] of routeMaps.staticRoutes.entries()) {
    if (path.startsWith(`${routePath}/`) || path === routePath) {
      const translation = getTranslation(keyName);
      if (translation) {
        return translation;
      }
    }
  }

  return null;
}

export function Breadcrumbs({
  items: customItems,
  homeLabel,
  showHomeIcon = true,
  maxMobileItems = 2,
  maxDesktopItems = 5,
  separator,
  className,
}: BreadcrumbsProps) {
  const pathname = usePathname();
  const lang = useCurrentLang();
  const direction = getDirection(lang);
  const isRTL = direction === "rtl";
  const t = useTranslation();

  // Create route maps for efficient lookups
  const publicRouteMaps = React.useMemo(() => createRouteMap(routesName), []);
  const dashboardRouteMaps = React.useMemo(
    () => createRouteMap(dashboardRoutesName),
    [],
  );

  // Get translation helper
  const getTranslation = React.useCallback(
    (keyName: string): string | null => {
      return getNestedTranslation(t, keyName);
    },
    [t],
  );

  // Get home label from translations
  const translatedHomeLabel =
    homeLabel || getTranslation("common.home") || "Home";

  // Generate breadcrumbs from pathname
  const breadcrumbItems = React.useMemo(() => {
    if (customItems) {
      return customItems;
    }

    // Remove language prefix from pathname
    const pathWithoutLang = pathname.replace(`/${lang}`, "") || "/";
    const segments = pathWithoutLang.split("/").filter(Boolean);

    const items: BreadcrumbItemType[] = [
      {
        label: translatedHomeLabel,
        href: `/${lang}`,
        icon: showHomeIcon ? <Home className="h-4 w-4" /> : undefined,
      },
    ];

    // Build breadcrumb items from segments
    let currentPath = `/${lang}`;
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === segments.length - 1;
      const segmentPath = `/${segments.slice(0, index + 1).join("/")}`;

      // Try to find route label (check dashboard routes first, then public routes)
      const label =
        findRouteLabel(segmentPath, dashboardRouteMaps, getTranslation) ||
        findRouteLabel(segmentPath, publicRouteMaps, getTranslation) ||
        capitalizeSegment(segment);

      items.push({
        label,
        href: isLast ? undefined : currentPath,
      });
    });

    return items;
  }, [
    customItems,
    pathname,
    lang,
    translatedHomeLabel,
    showHomeIcon,
    dashboardRouteMaps,
    publicRouteMaps,
    getTranslation,
  ]);

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

    const first = breadcrumbItems[0];
    const last = breadcrumbItems[breadcrumbItems.length - 1];
    const middle = breadcrumbItems.slice(1, -1);
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
        className={cn("flex-wrap items-center gap-1.5 sm:gap-2.5")}
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
