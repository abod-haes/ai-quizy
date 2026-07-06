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
  ({ className, type, startIcon, endIcon, onChange, ...props }, ref) => {
    const lang = useCurrentLang();
    const isRTL = lang === "ar";
    const [showPassword, setShowPassword] = React.useState(false);
    const isPassword = type === "password";
    const isTel = type === "tel";
    const inputType = isPassword && showPassword ? "text" : type;

    const handleTelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/\D/g, "");
      const syntheticEvent = {
        ...e,
        target: { ...e.target, value },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange?.(syntheticEvent);
    };

    const showPasswordToggle = isPassword && !endIcon;
    const iconPosition = isRTL ? "right-4" : "left-4";
    const endIconPosition = isRTL ? "left-4" : "right-4";
    const passwordTogglePosition = isRTL ? "left-4" : "right-4";

    return (
      <div className="group relative">
        {startIcon && (
          <span
            className={`text-muted-foreground group-focus-within:text-primary absolute top-1/2 ${iconPosition} z-10 -translate-y-1/2 transition-colors`}
          >
            {startIcon}
          </span>
        )}
        {endIcon && (
          <span
            className={`text-muted-foreground group-focus-within:text-primary absolute top-1/2 ${endIconPosition} z-10 -translate-y-1/2 transition-colors`}
          >
            {endIcon}
          </span>
        )}
        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={`text-muted-foreground hover:text-primary focus:ring-primary/40 absolute top-1/2 ${passwordTogglePosition} z-10 -translate-y-1/2 cursor-pointer rounded-xl p-1 transition-colors focus:ring-2 focus:ring-offset-0 focus:outline-none`}
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
          dir={isRTL ? "rtl" : "ltr"}
          inputMode={isTel ? "numeric" : undefined}
          onChange={isTel ? handleTelChange : onChange}
          className={cn(
            "border-input bg-background/80 text-foreground placeholder:text-muted-foreground/70 selection:bg-primary selection:text-primary-foreground flex min-h-11 w-full min-w-0 rounded-2xl border px-4 py-2.5 text-sm shadow-[0_12px_28px_-24px_var(--foreground)] outline-none transition-all duration-300 file:inline-flex file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            "focus-visible:border-primary/40 focus-visible:bg-background focus-visible:ring-primary/25 focus-visible:ring-[4px]",
            "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
            "[&[type=number]]:appearance-none [&[type=number]]::-webkit-inner-spin-button [&[type=number]]::-webkit-outer-spin-button",
            startIcon && !endIcon && !showPasswordToggle
              ? !isRTL
                ? "pr-4 pl-11"
                : "pr-11 pl-4"
              : !startIcon && (endIcon || showPasswordToggle)
                ? !isRTL
                  ? "pr-11 pl-4"
                  : "pr-4 pl-11"
                : startIcon && (endIcon || showPasswordToggle)
                  ? "px-11"
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
