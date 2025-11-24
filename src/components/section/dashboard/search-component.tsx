"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SearchComponentProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  showResultsCount?: boolean;
  resultsCount?: number;
}

export function SearchComponent({
  value,
  onChange,
  placeholder = "Search...",
  className,
  showResultsCount = true,
  resultsCount = 0,
}: SearchComponentProps) {
  const hasValue = value.length > 0;

  const handleClear = () => {
    onChange("");
  };

  return (
    <Card className={cn("border-0 shadow-sm", className)}>
      <CardContent className="p-4">
        <div className="relative">
          <div className="relative">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              type="text"
              placeholder={placeholder}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="border-border/50 focus:border-primary/50 h-11 pr-10 pl-10 transition-colors"
            />
            {hasValue && (
              <button
                onClick={handleClear}
                className="hover:bg-muted absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 transition-colors"
                aria-label="Clear search"
              >
                <X className="text-muted-foreground h-4 w-4" />
              </button>
            )}
          </div>

          {showResultsCount && hasValue && (
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {resultsCount} {resultsCount === 1 ? "result" : "results"}
                </Badge>
                {hasValue && (
                  <span className="text-muted-foreground text-sm">
                    for &ldquo;{value}&rdquo;
                  </span>
                )}
              </div>
              <button
                onClick={handleClear}
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
