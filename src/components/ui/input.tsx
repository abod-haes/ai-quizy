"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { useCurrentLang } from "@/hooks/useCurrentLang";

interface InputProps extends React.ComponentProps<"input"> {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, startIcon, endIcon, ...props }, ref) => {
    const lang = useCurrentLang();
    const isRTL = lang === "ar";
    return (
      <div className="relative">
        {startIcon && (
          <span
            className={`absolute top-1/2 ${isRTL ? "right-4" : "left-4"} z-10 -translate-y-1/2 text-slate-400`}
          >
            {startIcon}
          </span>
        )}
        {endIcon && (
          <span
            className={`absolute top-1/2 ${isRTL ? "left-4" : "right-4"} z-10 -translate-y-1/2 text-slate-400`}
          >
            {endIcon}
          </span>
        )}
        <input
          type={type}
          ref={ref}
          data-slot="input"
          suppressHydrationWarning
          className={cn(
            "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex w-full min-w-0 rounded-xl border bg-slate-50/50 px-3 py-2 text-sm text-slate-800 shadow-xs transition-all duration-200 outline-none file:inline-flex file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-sm disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            "[&[type=number]]:appearance-none",
            "[&[type=number]]::-webkit-outer-spin-button",
            "[&[type=number]]::-webkit-inner-spin-button",
            "focus-visible:border-primary focus-visible:ring-primary/50 focus-visible:ring-[3px]",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
            startIcon && (isRTL ? "pr-12 pl-4" : "pr-4 pl-12"),
            endIcon && (isRTL ? "pr-4 pl-12" : "pr-12 pl-4"),
            !startIcon && !endIcon && "px-4",
            className,
          )}
          {...props}
        />
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input };
