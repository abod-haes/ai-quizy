import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-bold tracking-wide outline-none transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 focus-visible:border-ring focus-visible:ring-ring/40 focus-visible:ring-[3px] aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 active:translate-y-0.5 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "border border-primary/20 bg-gradient-to-b from-primary to-primary/90 text-primary-foreground shadow-[0_14px_30px_-16px_var(--primary)] hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-18px_var(--primary)]",
        destructive:
          "border border-destructive/20 bg-destructive text-white shadow-[0_14px_30px_-18px_var(--destructive)] hover:-translate-y-0.5 hover:bg-destructive/90",
        outline:
          "border border-primary/20 bg-background/80 text-primary shadow-[0_12px_28px_-22px_var(--foreground)] hover:-translate-y-0.5 hover:bg-primary/8 hover:border-primary/35 dark:bg-input/20",
        secondary:
          "border border-border-secondary bg-secondary text-primary shadow-[0_14px_30px_-18px_var(--secondary)] hover:-translate-y-0.5 hover:bg-secondary/80",
        ghost:
          "bg-transparent text-primary hover:bg-primary/10 hover:text-primary/90",
        link: "rounded-md bg-transparent px-0 py-0 text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-6 py-2.5 has-[>svg]:px-5",
        sm: "h-9 rounded-xl gap-1.5 px-4 has-[>svg]:px-3",
        lg: "h-12 rounded-2xl px-8 text-base has-[>svg]:px-6",
        icon: "size-11 rounded-2xl",
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
