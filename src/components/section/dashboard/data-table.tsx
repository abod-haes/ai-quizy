/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Download,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface Column {
  accessor: string;
  header: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

export interface DataTableProps {
  data: any[];
  columns: Column[];
  className?: string;
  title?: string;
  subtitle?: string;
  showActions?: boolean;
  onRowClick?: (row: any) => void;
  loading?: boolean;
  emptyMessage?: string;
}

export function DataTable({
  data,
  columns,
  className,
  title,
  subtitle,
  showActions = true,
  onRowClick,
  loading = false,
  emptyMessage = "No data available",
}: DataTableProps) {
  const getStatusBadge = (status: string) => {
    const variants = {
      pending: { variant: "secondary" as const, icon: TrendingUp },
      completed: { variant: "default" as const, icon: TrendingDown },
      cancelled: { variant: "destructive" as const, icon: Minus },
    };

    const config =
      variants[status as keyof typeof variants] || variants.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      high: { variant: "destructive" as const, icon: TrendingUp },
      medium: { variant: "secondary" as const, icon: Minus },
      low: { variant: "outline" as const, icon: TrendingDown },
    };

    const config =
      variants[priority as keyof typeof variants] || variants.medium;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const defaultRender = (value: any, accessor: string) => {
    switch (accessor) {
      case "status":
        return getStatusBadge(value);
      case "priority":
        return getPriorityBadge(value);
      case "total":
        return formatCurrency(value);
      case "customer":
        return (
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium">
              {value
                .split(" ")
                .map((n: string) => n[0])
                .join("")}
            </div>
            <span className="font-medium">{value}</span>
          </div>
        );
      default:
        return value;
    }
  };

  if (loading) {
    return (
      <Card className={cn("border-0 shadow-sm", className)}>
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
            <span className="text-muted-foreground ml-2">Loading...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("border-0 shadow-sm", className)}>
      {(title || subtitle) && (
        <CardHeader className="pb-4">
          {title && <CardTitle>{title}</CardTitle>}
          {subtitle && (
            <p className="text-muted-foreground text-sm">{subtitle}</p>
          )}
        </CardHeader>
      )}

      <CardContent className="p-0">
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="bg-muted mb-4 flex h-12 w-12 items-center justify-center rounded-full">
              <Minus className="text-muted-foreground h-6 w-6" />
            </div>
            <p className="text-muted-foreground">{emptyMessage}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((column) => (
                    <TableHead key={column.accessor} className="font-semibold">
                      {column.header}
                    </TableHead>
                  ))}
                  {showActions && (
                    <TableHead className="w-[50px] text-right">
                      Actions
                    </TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((row, index) => (
                  <TableRow
                    key={index}
                    className="hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => onRowClick?.(row)}
                  >
                    {columns.map((column) => (
                      <TableCell key={column.accessor}>
                        {column.render
                          ? column.render(row[column.accessor], row)
                          : defaultRender(
                              row[column.accessor],
                              column.accessor,
                            )}
                      </TableCell>
                    ))}
                    {showActions && (
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              Export
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
