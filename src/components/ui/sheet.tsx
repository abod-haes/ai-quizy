"use client";

import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";

import { cn } from "@/lib/utils";

function VisuallyHidden({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        position: "absolute",
        width: 1,
        height: 1,
        padding: 0,
        margin: -1,
        overflow: "hidden",
        clip: "rect(0,0,0,0)",
        whiteSpace: "nowrap",
        border: 0,
      }}
    >
      {children}
    </span>
  );
}

function Sheet({ ...props }: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

function SheetTrigger({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

function SheetPortal({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Portal>) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />;
}

function SheetOverlay({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/40 backdrop-blur-sm",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:duration-200 data-[state=open]:duration-300",
        className,
      )}
      {...props}
    />
  );
}

function SheetContent({
  className,
  children,
  side = "right",
  title,
  hideTitle = false,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: "top" | "right" | "bottom" | "left";
  title?: React.ReactNode;
  hideTitle?: boolean;
}) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        className={cn(
          "fixed z-50 flex flex-col shadow-xl transition-all ease-out",
          "bg-background/98 supports-[backdrop-filter]:bg-background/95 backdrop-blur-md",
          "border-border/30 border",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:duration-200 data-[state=open]:duration-300",
          side === "right" &&
            cn(
              "inset-y-0 right-0 h-full w-full sm:max-w-sm",
              "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
            ),
          side === "left" &&
            cn(
              "inset-y-0 left-0 h-full w-full sm:max-w-sm",
              "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
            ),
          side === "top" &&
            cn(
              "inset-x-0 top-0 h-auto max-h-[90vh] border-b",
              "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
            ),
          side === "bottom" &&
            cn(
              "inset-x-0 bottom-0 h-auto max-h-[90vh] border-t",
              "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
            ),
          className,
        )}
        {...props}
      >
        {/* Always render a SheetTitle for accessibility, visually hidden if not provided */}
        {title ? (
          hideTitle ? (
            <VisuallyHidden>
              <SheetPrimitive.Title>{title}</SheetPrimitive.Title>
            </VisuallyHidden>
          ) : (
            <SheetPrimitive.Title className="text-foreground px-6 py-5 text-lg font-semibold">
              {title}
            </SheetPrimitive.Title>
          )
        ) : (
          <VisuallyHidden>
            <SheetPrimitive.Title>Sheet Dialog</SheetPrimitive.Title>
          </VisuallyHidden>
        )}

        <div className="relative flex-1 overflow-y-auto px-2">{children}</div>

        <SheetPrimitive.Close
          className={cn(
            "group absolute top-4 z-20 rounded-lg p-2 opacity-60 transition-all duration-200",
            "hover:bg-accent hover:opacity-100",
            "focus:ring-primary/20 focus:ring-2 focus:ring-offset-2 focus:outline-none",
            "disabled:pointer-events-none",
            side === "right" ? "right-4" : "left-4",
          )}
        >
          <XIcon className="text-foreground size-5" />
          <span className="sr-only">Close</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPortal>
  );
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn(
        "flex flex-col gap-2 px-6 py-4 text-center sm:text-left",
        className,
      )}
      {...props}
    />
  );
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn(
        "border-border/30 bg-background mt-auto flex flex-col gap-3 border-t px-6 py-4",
        className,
      )}
      {...props}
    />
  );
}

function SheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn("text-foreground text-lg font-semibold", className)}
      {...props}
    />
  );
}

function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
