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
import { Minus, EllipsisVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCurrentLang } from "@/hooks/useCurrentLang";
import { getDirection } from "@/utils/translations/language-utils";
import { TableLoading } from "./loading";

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
  pageSizeOptions?: number[];
  className?: string;
  tableClassName?: string;
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

  emptyMessage = "No data found",
  emptyIcon,
  showActions = true,
  actionMenuItems,
  renderActions,
  onRowClick,
  getRowKey,

  pageSizeOptions = [10, 20, 50, 100],
  className,
  tableClassName,
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
      if (typeof row === "object" && row !== null && "id" in row) {
        return (row as unknown as { id: string | number }).id;
      }
      return index;
    },
    [getRowKey],
  );

  // Memoize action menu items
  const menuItems = React.useMemo(
    () => actionMenuItems || [],
    [actionMenuItems],
  );

  // Memoize columns
  const memoizedColumns = React.useMemo(() => columns, [columns]);
  return (
    <div
      className={cn(
        "bg-sidebar border-border rounded-lg border p-5",
        className,
      )}
      dir={direction}
    >
      {loading && <TableLoading />}

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
          <div className={cn("relative overflow-hidden", tableClassName)}>
            <div className="max-h-[600px] overflow-x-auto overflow-y-auto">
              <Table>
                <TableHeader className="bg-sidebar sticky top-0 z-10">
                  <TableRow>
                    {memoizedColumns.map((column) => (
                      <TableHead
                        key={String(column.accessor)}
                        className={cn(
                          "bg-sidebar font-semibold whitespace-nowrap",
                          column.headerClassName,
                          column.width,
                          column.sortable && "cursor-pointer select-none",
                          isRTL ? "rtl:text-right" : "ltr:text-start",
                        )}
                      >
                        {column.header}
                      </TableHead>
                    ))}
                    {showActions && (
                      <TableHead
                        className={cn(
                          "bg-sidebar w-[50px] whitespace-nowrap",
                          isRTL ? "rtl:text-right" : "ltr:text-start",
                        )}
                      >
                        Actions
                      </TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((row, index) => {
                    const rowKey = getKey(row, index);
                    return (
                      <TableRow
                        key={rowKey}
                        className={cn(
                          "hover:bg-muted/50 transition-colors",
                          onRowClick && "cursor-pointer",
                        )}
                        onClick={() => onRowClick?.(row, index)}
                      >
                        {memoizedColumns.map((column) => {
                          const value =
                            column.accessor in row
                              ? (row[column.accessor as keyof T] as unknown)
                              : undefined;
                          return (
                            <TableCell
                              key={String(column.accessor)}
                              className={cn(
                                "whitespace-nowrap",
                                column.cellClassName,
                                isRTL ? "rtl:text-right" : "ltr:text-start",
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
                            className={cn(
                              "whitespace-nowrap",
                              isRTL ? "rtl:text-right" : "ltr:text-start",
                            )}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {renderActions ? (
                              renderActions(row, index)
                            ) : (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
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
                                  {menuItems.map((item, idx) => (
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
                                          item.variant === "Edit" &&
                                            "text-primary hover:text-primary/90 hover:bg-primary/10 focus:bg-primary/10 focus:text-primary",
                                          item.variant === "default" &&
                                            "text-green-600 hover:bg-green-50 hover:text-green-700 focus:bg-green-50 focus:text-green-700",
                                        )}
                                        onClick={() => item.onClick(row)}
                                      >
                                        {item.icon && (
                                          <span
                                            className={cn(
                                              isRTL
                                                ? "rtl:mr-0 rtl:ml-2"
                                                : "ltr:mr-2 ltr:ml-0",
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
                    );
                  })}
                </TableBody>
              </Table>
            </div>
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
