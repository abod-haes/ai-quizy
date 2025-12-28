"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCurrentLang } from "@/hooks/useCurrentLang";
import { getDirection } from "@/utils/translations/language-utils";
import { cn } from "@/lib/utils";
import { AlertTriangle, Info, Trash2 } from "lucide-react";

export type ConfirmDialogVariant = "delete" | "warning" | "info";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void> | void;
  variant?: ConfirmDialogVariant;
  title?: string;
  description?: string;
  isLoading?: boolean;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

const variantConfig: Record<
  ConfirmDialogVariant,
  {
    icon: React.ComponentType<{ className?: string }>;
    iconBgClass: string;
    iconClass: string;
    defaultTitle: string;
    defaultConfirmText: string;
    defaultConfirmVariant: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  }
> = {
  delete: {
    icon: Trash2,
    iconBgClass: "bg-destructive/10 dark:bg-destructive/20",
    iconClass: "text-destructive",
    defaultTitle: "Delete Item",
    defaultConfirmText: "Delete",
    defaultConfirmVariant: "destructive",
  },
  warning: {
    icon: AlertTriangle,
    iconBgClass: "bg-amber-500/10 dark:bg-amber-500/20",
    iconClass: "text-amber-600 dark:text-amber-500",
    defaultTitle: "Warning",
    defaultConfirmText: "Continue",
    defaultConfirmVariant: "default",
  },
  info: {
    icon: Info,
    iconBgClass: "bg-blue-500/10 dark:bg-blue-500/20",
    iconClass: "text-blue-600 dark:text-blue-500",
    defaultTitle: "Information",
    defaultConfirmText: "OK",
    defaultConfirmVariant: "default",
  },
};

export function ConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  variant = "delete",
  title,
  description,
  isLoading = false,
  confirmText,
  cancelText = "Cancel",
  confirmVariant,
}: ConfirmDialogProps) {
  const lang = useCurrentLang();
  const direction = getDirection(lang);
  const isRTL = direction === "rtl";

  const config = variantConfig[variant];
  const Icon = config.icon;

  const handleConfirm = async () => {
    try {
      await onConfirm();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to confirm action:", error);
    }
  };

  const finalTitle = title || config.defaultTitle;
  const finalConfirmText = confirmText || config.defaultConfirmText;
  const finalConfirmVariant = confirmVariant || config.defaultConfirmVariant;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "sm:max-w-[500px] p-0 gap-0",
          isRTL && "rtl:text-start"
        )}
        dir={direction}
      >
        <div className="flex flex-col items-center px-6 pt-10 pb-6">
          {/* Large Icon at Top */}
          <div
            className={cn(
              "flex h-20 w-20 shrink-0 items-center justify-center rounded-full mb-5 transition-all duration-200 shadow-md ring-4 ring-background",
              config.iconBgClass,
            )}
          >
            <Icon className={cn("h-10 w-10", config.iconClass)} />
          </div>

          {/* Title */}
          <DialogHeader className="text-center pb-3">
            <DialogTitle className="text-2xl font-semibold leading-tight tracking-tight">
              {finalTitle}
            </DialogTitle>
          </DialogHeader>

          {/* Description */}
          {description && (
            <DialogDescription
              className={cn(
                "text-center text-muted-foreground text-base leading-relaxed max-w-md mt-1",
                isRTL && "rtl:text-center"
              )}
            >
              {description}
            </DialogDescription>
          )}
        </div>

        {/* Footer with Actions */}
        <DialogFooter className={cn(
          "flex gap-3 px-6 pb-6 pt-4 border-t bg-muted/30",
          isRTL && "flex-row-reverse"
        )}>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="flex-1"
          >
            {cancelText}
          </Button>
          <Button
            variant={finalConfirmVariant}
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading
              ? variant === "delete"
                ? "Deleting..."
                : variant === "warning"
                  ? "Processing..."
                  : "Loading..."
              : finalConfirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

