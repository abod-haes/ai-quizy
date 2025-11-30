"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { TablePagination } from "./table-pagination";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  Minus,
  EllipsisVertical,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCurrentLang } from "@/hooks/useCurrentLang";
import { getDirection } from "@/utils/translations/language-utils";

export type SortDirection = "asc" | "desc" | null;

export interface SortConfig {
  field: string;
  direction: SortDirection;
}

export interface Column<
  T extends Record<string, unknown> = Record<string, unknown>,
> {
  accessor: keyof T | string;
  header: string;
  sortable?: boolean;
  render?: (value: unknown, row: T, index: number) => React.ReactNode;
  headerClassName?: string;
  cellClassName?: string;
  width?: string;
}

export interface ActionMenuItem<
  T extends Record<string, unknown> = Record<string, unknown>,
> {
  label: string;
  icon?: React.ReactNode;
  onClick: (row: T) => void;
  variant?: "default" | "destructive" | "Edit";
  separator?: boolean;
}

export interface DataTableWithPaginationProps<
  T extends Record<string, unknown> = Record<string, unknown>,
> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  title?: string;
  subtitle?: string;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  showActions?: boolean;
  actionMenuItems?: ActionMenuItem<T>[];
  renderActions?: (row: T, index: number) => React.ReactNode;
  onRowClick?: (row: T, index: number) => void;
  getRowKey?: (row: T, index: number) => string | number;
  sortConfig?: SortConfig;
  onSortChange?: (field: string, direction: SortDirection) => void;
  pageSizeOptions?: number[];
  className?: string;
  tableClassName?: string;
  showSearch?: boolean;
  searchValue?: string;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
  showFilters?: boolean;
  renderFilters?: () => React.ReactNode;
}

export function DataTableWithPagination<
  T extends Record<string, unknown> = Record<string, unknown>,
>({
  data,
  columns,
  loading = false,
  totalCount,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  title,
  subtitle,
  emptyMessage = "No data found",
  emptyIcon,
  showActions = true,
  actionMenuItems,
  renderActions,
  onRowClick,
  getRowKey,
  sortConfig,
  onSortChange,
  pageSizeOptions = [10, 20, 50, 100],
  className,
  tableClassName,
  showSearch = false,
  searchValue,
  searchPlaceholder = "Search...",
  onSearchChange,
  showFilters = false,
  renderFilters,
}: DataTableWithPaginationProps<T>) {
  const lang = useCurrentLang();
  const direction = getDirection(lang);
  const isRTL = direction === "rtl";

  // Get row key function
  const getKey = React.useCallback(
    (row: T, index: number): string | number => {
      if (getRowKey) {
        return getRowKey(row, index);
      }
      // Try to get id property
      if (typeof row === "object" && row !== null && "id" in row) {
        const idValue = (row as unknown as { id: string | number }).id;
        return idValue;
      }
      return index;
    },
    [getRowKey],
  );

  const handleSort = (field: string) => {
    if (
      !onSortChange ||
      !columns.find((col) => col.accessor === field)?.sortable
    ) {
      return;
    }

    const currentDirection =
      sortConfig?.field === field ? sortConfig.direction : null;
    let newDirection: SortDirection = "asc";

    if (currentDirection === "asc") {
      newDirection = "desc";
    } else if (currentDirection === "desc") {
      newDirection = null;
    }

    onSortChange(field, newDirection);
  };

  const getSortIcon = (field: string) => {
    if (!sortConfig || sortConfig.field !== field) {
      return <ArrowUpDown className="h-4 w-4 opacity-50" />;
    }
    if (sortConfig.direction === "asc") {
      return <ArrowUp className="h-4 w-4" />;
    }
    if (sortConfig.direction === "desc") {
      return <ArrowDown className="h-4 w-4" />;
    }
    return <ArrowUpDown className="h-4 w-4 opacity-50" />;
  };

  const defaultActionMenuItems: ActionMenuItem<T>[] = actionMenuItems || [
    {
      label: "View",
      icon: <MoreHorizontal className="h-4 w-4" />,
      onClick: () => {},
      variant: "default",
    },
    {
      label: "Edit",
      icon: <MoreHorizontal className="h-4 w-4" />,
      onClick: () => {},
      variant: "Edit",
    },
    {
      label: "Delete",
      icon: <MoreHorizontal className="h-4 w-4" />,
      onClick: () => {},
      variant: "destructive",
      separator: true,
    },
  ];

  return (
    <div
      className={cn(
        "bg-sidebar border-border rounded-lg border p-5",
        className,
      )}
      dir={direction}
    >
      {(title || subtitle || showSearch || showFilters) && (
        <div className="mb-4 border-b pb-4">
          {title && (
            <h2
              className={cn("text-lg font-semibold", isRTL && "rtl:text-right")}
            >
              {title}
            </h2>
          )}
          {subtitle && (
            <p
              className={cn(
                "text-muted-foreground mt-1 text-sm",
                isRTL && "rtl:text-right",
              )}
            >
              {subtitle}
            </p>
          )}

          {showSearch && onSearchChange && (
            <div className="mt-4">
              <input
                type="text"
                value={searchValue || ""}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
                className={cn(
                  "border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
                  isRTL && "rtl:text-right",
                )}
              />
            </div>
          )}

          {showFilters && renderFilters && (
            <div className="mt-4">{renderFilters()}</div>
          )}
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
          <span className="text-muted-foreground ml-2">Loading...</span>
        </div>
      )}

      {!loading && data.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          {emptyIcon || (
            <div className="bg-muted mb-4 flex h-12 w-12 items-center justify-center rounded-full">
              <Minus className="text-muted-foreground h-6 w-6" />
            </div>
          )}
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
      )}

      {!loading && data.length > 0 && (
        <>
          <div className={cn("overflow-x-auto", tableClassName)}>
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((column) => (
                    <TableHead
                      key={String(column.accessor)}
                      className={cn(
                        "font-semibold",
                        column.headerClassName,
                        column.width,
                        column.sortable && "cursor-pointer select-none",
                        isRTL && "rtl:text-right",
                      )}
                      onClick={() =>
                        column.sortable && handleSort(String(column.accessor))
                      }
                    >
                      <div
                        className={cn(
                          "flex items-center gap-2",
                          isRTL && "rtl:flex-row-reverse",
                        )}
                      >
                        <span>{column.header}</span>
                        {column.sortable &&
                          getSortIcon(String(column.accessor))}
                      </div>
                    </TableHead>
                  ))}
                  {showActions && (
                    <TableHead
                      className={cn(
                        "w-[50px] text-right",
                        isRTL && "rtl:text-left",
                      )}
                    >
                      Actions
                    </TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((row, index) => (
                  <TableRow
                    key={getKey(row, index)}
                    className={cn(
                      "hover:bg-muted/50 transition-colors",
                      onRowClick && "cursor-pointer",
                    )}
                    onClick={() => onRowClick?.(row, index)}
                  >
                    {columns.map((column) => {
                      const value =
                        column.accessor in row
                          ? (row[column.accessor as keyof T] as unknown)
                          : undefined;
                      return (
                        <TableCell
                          key={String(column.accessor)}
                          className={cn(
                            column.cellClassName,
                            isRTL && "rtl:text-right",
                          )}
                        >
                          {column.render
                            ? column.render(value, row, index)
                            : value !== null && value !== undefined
                              ? String(value)
                              : "-"}
                        </TableCell>
                      );
                    })}
                    {showActions && (
                      <TableCell
                        className={cn("text-right", isRTL && "rtl:text-left")}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {renderActions ? (
                          renderActions(row, index)
                        ) : (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size={"icon"}
                                className="h-8 w-8 p-0"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <EllipsisVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align={isRTL ? "start" : "end"}
                              className={cn(isRTL && "rtl:text-right")}
                            >
                              {defaultActionMenuItems.map((item, idx) => (
                                <React.Fragment key={idx}>
                                  {item.separator && idx > 0 && (
                                    <DropdownMenuSeparator />
                                  )}
                                  <DropdownMenuItem
                                    variant={
                                      item.variant === "destructive"
                                        ? "destructive"
                                        : undefined
                                    }
                                    className={cn(
                                      "cursor-pointer",
                                      isRTL && "rtl:flex-row-reverse",
                                      item.variant === "Edit" &&
                                        "text-primary hover:text-primary/90 hover:bg-primary/10 focus:bg-primary/10 focus:text-primary",
                                      item.variant === "default" &&
                                        "text-green-600! hover:bg-green-50! hover:text-green-700! focus:bg-green-50! focus:text-green-700!",
                                    )}
                                    onClick={() => item.onClick(row)}
                                  >
                                    {item.icon && (
                                      <span
                                        className={cn(
                                          item.variant === "destructive" &&
                                            "mr-2",
                                          isRTL && "rtl:mr-0 rtl:ml-2",
                                        )}
                                      >
                                        {item.icon}
                                      </span>
                                    )}
                                    {item.label}
                                  </DropdownMenuItem>
                                </React.Fragment>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {totalCount > 0 && (
            <div className="mt-6 border-t pt-4">
              <TablePagination
                currentPage={currentPage}
                totalCount={totalCount}
                pageSize={pageSize}
                onPageChange={onPageChange}
                onPageSizeChange={onPageSizeChange}
                pageSizeOptions={pageSizeOptions}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
