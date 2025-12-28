"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingProps {
  /**
   * Size of the spinner
   * @default "md"
   */
  size?: "sm" | "md" | "lg" | "xl";
  /**
   * Loading message to display
   */
  message?: string;
  /**
   * Full page loading overlay
   * @default false
   */
  fullPage?: boolean;
  /**
   * Inline loading (for buttons, small areas)
   * @default false
   */
  inline?: boolean;
  /**
   * Custom className
   */
  className?: string;
  /**
   * Spinner only (no message)
   * @default false
   */
  spinnerOnly?: boolean;
}

const sizeClasses = {
  sm: "size-4",
  md: "size-6",
  lg: "size-8",
  xl: "size-12",
};

export function Loading({
  size = "md",
  message,
  fullPage = false,
  inline = false,
  className,
  spinnerOnly = false,
}: LoadingProps) {
  const spinnerSize = sizeClasses[size];

  if (fullPage) {
    return (
      <div
        className={cn(
          "bg-background/80 fixed inset-0 z-50 flex items-center justify-center",
          className,
        )}
      >
        <div className="flex flex-col items-center gap-4">
          <Loader2 className={cn("text-primary animate-spin", spinnerSize)} />
          {!spinnerOnly && message && (
            <p className="text-muted-foreground">{message}</p>
          )}
        </div>
      </div>
    );
  }

  if (inline) {
    return (
      <div className={cn("inline-flex items-center gap-2", className)}>
        <Loader2 className={cn("text-primary animate-spin", spinnerSize)} />
        {!spinnerOnly && message && (
          <span className="text-muted-foreground text-sm">{message}</span>
        )}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="flex flex-col items-center gap-4">
        <Loader2 className={cn("text-primary animate-spin", spinnerSize)} />
        {!spinnerOnly && message && (
          <p className="text-muted-foreground">{message}</p>
        )}
      </div>
    </div>
  );
}

/**
 * Loading component for buttons
 */
export function ButtonLoading({ size = "sm" }: { size?: "sm" | "md" }) {
  return (
    <Loader2
      className={cn(
        "animate-spin",
        size === "sm" ? "size-4" : "size-5",
      )}
    />
  );
}

/**
 * Loading component for table/data loading states
 */
export function TableLoading({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="text-primary size-8 animate-spin" />
        <p className="text-muted-foreground text-sm">{message}</p>
      </div>
    </div>
  );
}

/**
 * Loading component for page content
 */
export function PageLoading({ message }: { message?: string }) {
  return (
    <div className="container mx-auto flex items-center justify-center px-4 py-20">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="text-primary size-8 animate-spin" />
        {message && <p className="text-muted-foreground">{message}</p>}
      </div>
    </div>
  );
}

/**
 * Loading skeleton for cards
 */
export function CardLoading() {
  return (
    <div className="bg-sidebar border-border rounded-lg border p-5">
      <div className="space-y-4">
        <div className="bg-muted h-6 w-1/3 animate-pulse rounded" />
        <div className="bg-muted h-4 w-full animate-pulse rounded" />
        <div className="bg-muted h-4 w-2/3 animate-pulse rounded" />
      </div>
    </div>
  );
}

