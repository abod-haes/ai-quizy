"use client";
import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
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
    const [showPassword, setShowPassword] = React.useState(false);
    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;

    // If type is password and no endIcon is provided, show password toggle
    const showPasswordToggle = isPassword && !endIcon;

    return (
      <div className="relative">
        {startIcon && (
          <span
            className={`absolute top-1/2 ${isRTL ? "right-3" : "left-3"} z-10 -translate-y-1/2 text-slate-400`}
          >
            {startIcon}
          </span>
        )}
        {endIcon && (
          <span
            className={`absolute top-1/2 ${isRTL ? "left-3" : "right-3"} z-10 -translate-y-1/2 text-slate-400`}
          >
            {endIcon}
          </span>
        )}
        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={`absolute top-1/2 ${isRTL ? "left-3" : "right-3"} focus:ring-primary/50 z-10 -translate-y-1/2 cursor-pointer rounded p-1 text-slate-400 transition-colors hover:text-slate-600 focus:ring-2 focus:ring-offset-0 focus:outline-none`}
            aria-label={showPassword ? "Hide password" : "Show password"}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        )}
        <input
          type={inputType}
          ref={ref}
          data-slot="input"
          suppressHydrationWarning
          className={cn(
            "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex w-full min-w-0 rounded-xl border bg-slate-50/50 py-2 text-sm text-slate-800 shadow-xs transition-all duration-200 outline-none file:inline-flex file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-sm disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:text-white",
            "[&[type=number]]:appearance-none",
            "[&[type=number]]::-webkit-outer-spin-button",
            "[&[type=number]]::-webkit-inner-spin-button",
            "focus-visible:border-primary focus-visible:ring-primary/50 focus-visible:ring-[3px]",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
            // Padding logic: handle startIcon, endIcon/passwordToggle, and default cases
            startIcon && !endIcon && !showPasswordToggle
              ? isRTL
                ? "pr-10 pl-3"
                : "pr-3 pl-10"
              : !startIcon && (endIcon || showPasswordToggle)
                ? isRTL
                  ? "pr-3 pl-10"
                  : "pr-10 pl-3"
                : startIcon && (endIcon || showPasswordToggle)
                  ? "pr-10 pl-10"
                  : "px-4",
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
