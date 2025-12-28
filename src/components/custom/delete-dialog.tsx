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
import { AlertTriangle } from "lucide-react";

interface DeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void> | void;
  title?: string;
  description?: string;
  itemName?: string;
  isLoading?: boolean;
  confirmText?: string;
  cancelText?: string;
}

export function DeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  title = "Delete Item",
  description,
  itemName,
  isLoading = false,
  confirmText = "Delete",
  cancelText = "Cancel",
}: DeleteDialogProps) {
  const lang = useCurrentLang();
  const direction = getDirection(lang);
  const isRTL = direction === "rtl";

  const handleConfirm = async () => {
    try {
      await onConfirm();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  const defaultDescription = itemName
    ? `Are you sure you want to delete "${itemName}"? This action cannot be undone.`
    : "Are you sure you want to delete this item? This action cannot be undone.";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn("sm:max-w-[425px]", isRTL && "rtl:text-start")}
        dir={direction}
      >
        <DialogHeader className="border-b pb-2">
          <div className={cn("flex items-center gap-3")}>
            <div className="bg-destructive/10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
              <AlertTriangle className="text-destructive h-4 w-4" />
            </div>
            <div className={cn("flex-1", isRTL && "rtl:text-start")}>
              <DialogTitle>{title}</DialogTitle>
            </div>
          </div>
        </DialogHeader>
        <DialogDescription className={cn("pt-2", isRTL && "rtl:text-start")}>
          {description || defaultDescription}
        </DialogDescription>

        <DialogFooter className={cn("flex gap-2! sm:gap-0")}>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            size={"sm"}
          >
            {cancelText}
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading}
            size={"sm"}
          >
            {isLoading ? "Deleting..." : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
