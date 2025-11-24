"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Filter,
  X,
  CheckCircle2,
  Clock,
  XCircle,
  Star,
  Zap,
  Minus,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface FilterOption {
  value: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  count?: number;
}

export interface FilterChangeHandler {
  status?: string;
  priority?: string;
}

export interface FilterComponentProps {
  onFilterChange?: (filters: FilterChangeHandler) => void;
  status?: string;
  priority?: string;
  className?: string;
  showActiveFilters?: boolean;
  statusCounts?: Record<string, number>;
  priorityCounts?: Record<string, number>;
}

const statusOptions: FilterOption[] = [
  { value: "all", label: "All Orders", icon: CheckCircle2 },
  { value: "pending", label: "Pending", icon: Clock },
  { value: "completed", label: "Completed", icon: CheckCircle2 },
  { value: "cancelled", label: "Cancelled", icon: XCircle },
];

const priorityOptions: FilterOption[] = [
  { value: "all", label: "All Priorities", icon: Minus },
  { value: "high", label: "High", icon: Star },
  { value: "medium", label: "Medium", icon: Zap },
  { value: "low", label: "Low", icon: Minus },
];

export function FilterComponent({
  onFilterChange,
  status = "all",
  priority = "all",
  className,
  showActiveFilters = true,
  statusCounts,
  priorityCounts,
}: FilterComponentProps) {
  const hasActiveFilters = status !== "all" || priority !== "all";

  const handleFilterChange = (
    filterType: keyof FilterChangeHandler,
    value: string,
  ) => {
    onFilterChange?.({ [filterType]: value });
  };

  const clearAllFilters = () => {
    onFilterChange?.({ status: "all", priority: "all" });
  };

  const getStatusIcon = (value: string) => {
    const option = statusOptions.find((opt) => opt.value === value);
    return option?.icon || CheckCircle2;
  };

  const getPriorityIcon = (value: string) => {
    const option = priorityOptions.find((opt) => opt.value === value);
    return option?.icon || Minus;
  };

  return (
    <Card className={cn("border-0 shadow-sm", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Filter className="h-4 w-4" />
            Filters
          </CardTitle>
          {hasActiveFilters && showActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-muted-foreground hover:text-foreground h-8 px-2 text-xs"
            >
              <X className="mr-1 h-3 w-3" />
              Clear all
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Status Filter */}
          <div className="space-y-2">
            <label className="text-foreground text-sm font-medium">
              Status
            </label>
            <Select
              value={status}
              onValueChange={(value) => handleFilterChange("status", value)}
            >
              <SelectTrigger className="border-border/50 focus:border-primary/50 h-10">
                <div className="flex items-center gap-2">
                  {React.createElement(getStatusIcon(status), {
                    className: "h-4 w-4 text-muted-foreground",
                  })}
                  <SelectValue placeholder="Filter by status" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => {
                  const Icon = option.icon!;
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex w-full items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {option.label}
                        </div>
                        {statusCounts?.[option.value] && (
                          <Badge variant="secondary" className="ml-2 text-xs">
                            {statusCounts[option.value]}
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Priority Filter */}
          <div className="space-y-2">
            <label className="text-foreground text-sm font-medium">
              Priority
            </label>
            <Select
              value={priority}
              onValueChange={(value) => handleFilterChange("priority", value)}
            >
              <SelectTrigger className="border-border/50 focus:border-primary/50 h-10">
                <div className="flex items-center gap-2">
                  {React.createElement(getPriorityIcon(priority), {
                    className: "h-4 w-4 text-muted-foreground",
                  })}
                  <SelectValue placeholder="Filter by priority" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {priorityOptions.map((option) => {
                  const Icon = option.icon!;
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex w-full items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {option.label}
                        </div>
                        {priorityCounts?.[option.value] && (
                          <Badge variant="secondary" className="ml-2 text-xs">
                            {priorityCounts[option.value]}
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Filters Display */}
        {showActiveFilters && hasActiveFilters && (
          <>
            <Separator className="my-4" />
            <div className="space-y-2">
              <p className="text-foreground text-sm font-medium">
                Active Filters
              </p>
              <div className="flex flex-wrap gap-2">
                {status !== "all" && (
                  <Badge variant="outline" className="gap-1">
                    <Filter className="h-3 w-3" />
                    Status:{" "}
                    {statusOptions.find((opt) => opt.value === status)?.label}
                    <button
                      onClick={() => handleFilterChange("status", "all")}
                      className="hover:bg-muted ml-1 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {priority !== "all" && (
                  <Badge variant="outline" className="gap-1">
                    <Filter className="h-3 w-3" />
                    Priority:{" "}
                    {
                      priorityOptions.find((opt) => opt.value === priority)
                        ?.label
                    }
                    <button
                      onClick={() => handleFilterChange("priority", "all")}
                      className="hover:bg-muted ml-1 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
