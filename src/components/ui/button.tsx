import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import { cn } from "@/lib/utils";
// export const buttonStyles = () =>
//   tw`  transition-all duration-300 border-none  font-Raleway tracking-tight   rounded-[8px] font-[600] justify-center flex items-center   cursor-pointer ! tracking-wide capitalize font-bold   py-[12px]! sm:px-[32px] px-[20px]  text-[12px]!  whitespace-nowrap focus:outline-none`;
const buttonVariants = cva(
  "inline-flex cursor-pointer  hover:scale-100  outline-none items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive  active:translate-y-0 active:scale-[0.98]  tracking-wide",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-white shadow-lg hover:bg-primary/90 hover:shadow-xl border-b-2 border-border-primary active:scale-[0.98]",
        destructive:
          "bg-destructive text-white shadow-lg hover:bg-destructive/90 hover:shadow-xl focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 border-b-2 border-destructive/60 active:scale-[0.98]",
        outline:
          "border bg-background shadow-lg  text-primary hover:shadow-xl dark:bg-input/30 dark:border-input dark:hover:bg-input/50   border-b-2 border-primary/60 active:scale-[0.98]",
        secondary:
          "bg-secondary text-primary shadow-lg hover:bg-secondary/80 hover:shadow-xl border-b-2 border-border-secondary active:scale-[0.98]",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 active:scale-[0.98]   text-primary bg-transparent hover:bg-primary/10 hover:text-primary/90 px-4 py-2 rounded-full transition-all duration-300  hover:shadow-md relative overflow-hidden group before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary/20 before:to-transparent before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100 active:scale-[0.98]",
        link: " text-primary bg-transparent hover:text-primary/90  px-1.5! py-0! rounded-full transition-all duration-300 relative overflow-hidden group before:absolute before:bottom-2 before:left-0 before:h-0.5 before:w-0 before:bg-primary before:transition-all before:duration-300 hover:before:w-full active:scale-[0.98]",
      },
      size: {
        default: "h-10 px-6 py-2 has-[>svg]:px-6",
        sm: "h-8 rounded-full gap-1.5 px-4 has-[>svg]:px-4",
        lg: "h-12 rounded-full px-8 has-[>svg]:px-6 text-base",
        icon: "size-12",
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

  // If asChild is true, use Slot
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

  // If href is provided, render as Link
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

  // Otherwise, render as button
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
