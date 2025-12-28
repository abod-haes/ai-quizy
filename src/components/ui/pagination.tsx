"use client";

import * as React from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { useCurrentLang } from "@/hooks/useCurrentLang";
import { useTranslation } from "@/providers/TranslationsProvider";

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  const lang = useCurrentLang();
  const isRTL = lang === "ar";

  return (
    <ul
      data-slot="pagination-content"
      dir={isRTL ? "rtl" : "ltr"}
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  );
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<React.ComponentProps<typeof Button>, "size"> &
  React.ComponentProps<"a">;

function PaginationLink({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
          size,
        }),
        className,
      )}
      {...props}
    />
  );
}

function PaginationPrevious({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  const lang = useCurrentLang();
  const isRTL = lang === "ar";
  const t = useTranslation();
  const pagination = t.dashboard?.common?.pagination;
  const ChevronIcon = isRTL ? ChevronRightIcon : ChevronLeftIcon;

  return (
    <PaginationLink
      aria-label={pagination?.previousAriaLabel}
      size="default"
      className={cn(
        "gap-1 px-2.5",
        isRTL ? "sm:pr-2.5" : "sm:pl-2.5",
        className,
      )}
      {...props}
    >
      <ChevronIcon className="rlt:" />
      <span className="hidden sm:block">{pagination.previous}</span>
    </PaginationLink>
  );
}

function PaginationNext({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  const lang = useCurrentLang();
  const isRTL = lang === "ar";
  const { dashboard } = useTranslation();
  const pagination = dashboard.common.pagination;
  const ChevronIcon = isRTL ? ChevronLeftIcon : ChevronRightIcon;

  return (
    <PaginationLink
      aria-label={pagination.nextAriaLabel}
      size="default"
      className={cn(
        "gap-1 px-2.5",
        isRTL ? "sm:pl-2.5" : "sm:pr-2.5",
        className,
      )}
      {...props}
    >
      <span className="hidden sm:block">{pagination.next}</span>
      <ChevronIcon />
    </PaginationLink>
  );
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  const t = useTranslation();
  const pagination = t.dashboard?.common?.pagination;
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">{pagination?.morePages}</span>
    </span>
  );
}

// Complete Pagination Component with logic
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

function PaginationComponent({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(currentPage - 1);
            }}
            className={cn(
              currentPage === 1 && "pointer-events-none opacity-50",
            )}
          />
        </PaginationItem>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
          if (
            pageNum === 1 ||
            pageNum === totalPages ||
            (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
          ) {
            return (
              <PaginationItem key={pageNum}>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(pageNum);
                  }}
                  isActive={pageNum === currentPage}
                >
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            );
          } else if (
            pageNum === currentPage - 2 ||
            pageNum === currentPage + 2
          ) {
            return (
              <PaginationItem key={pageNum}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }
          return null;
        })}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(currentPage + 1);
            }}
            className={cn(
              currentPage === totalPages && "pointer-events-none opacity-50",
            )}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
  PaginationComponent,
};
