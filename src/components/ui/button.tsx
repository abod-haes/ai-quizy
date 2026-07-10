import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-bold outline-none transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 focus-visible:ring-ring/30 focus-visible:ring-[3px] aria-invalid:border-destructive aria-invalid:ring-destructive/20 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "border border-primary bg-primary text-primary-foreground shadow-[0_8px_18px_-15px_var(--primary)] hover:bg-primary/90",
        destructive:
          "border border-destructive bg-destructive text-white shadow-sm hover:bg-destructive/90",
        outline:
          "border border-primary/20 bg-card text-primary shadow-sm hover:border-primary/30 hover:bg-primary/10",
        secondary:
          "border border-border bg-muted text-foreground shadow-sm hover:bg-muted/80",
        ghost:
          "bg-transparent text-primary hover:bg-primary/10 hover:text-primary",
        link: "rounded-md bg-transparent px-0 py-0 text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-2 has-[>svg]:px-4",
        sm: "h-8 rounded-xl gap-1.5 px-3 text-xs has-[>svg]:px-2.5",
        lg: "h-11 rounded-2xl px-6 text-sm has-[>svg]:px-5",
        icon: "size-10 rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type ButtonProps = VariantProps<typeof buttonVariants> & {
  asChild?: boolean;
  disabled?: boolean;
  href?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

function Button({
  className,
  variant,
  size,
  asChild = false,
  href,
  disabled,
  ...props
}: ButtonProps) {
  const buttonClasses = cn(buttonVariants({ variant, size, className }));

  if (asChild) {
    return (
      <Slot
        data-slot="button"
        className={buttonClasses}
        disabled={disabled}
        {...(props as React.ComponentProps<"button">)}
      />
    );
  }

  if (href) {
    const { children, ...linkProps } = props as Omit<
      React.ComponentProps<typeof Link>,
      "href"
    >;
    return (
      <Link
        data-slot="button"
        href={href}
        className={buttonClasses}
        {...linkProps}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      data-slot="button"
      className={buttonClasses}
      disabled={disabled}
      {...(props as React.ComponentProps<"button">)}
    />
  );
}

export { Button, buttonVariants };
