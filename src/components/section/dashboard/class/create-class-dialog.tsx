"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import DynamicForm, {
  type FormDefinition,
} from "@/components/form-render/form-render";
import { useCurrentLang } from "@/hooks/useCurrentLang";
import { getDirection } from "@/utils/translations/language-utils";
import { cn } from "@/lib/utils";
import type { CreateClassInput } from "@/services/classes.services/classes.type";
import { useTranslation } from "@/providers/TranslationsProvider";

interface CreateClassDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateClassInput) => Promise<void>;
  isLoading?: boolean;
}

export function CreateClassDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
}: CreateClassDialogProps) {
  const lang = useCurrentLang();
  const direction = getDirection(lang);
  const isRTL = direction === "rtl";
  const t = useTranslation();
  const classesDict = t.dashboard.classes;

  const formDefinition: FormDefinition = React.useMemo(
    () => ({
      id: "create-class-form",
      fields: [
        {
          key: "name",
          type: "text",
          label: "Name",
          placeholder: "Enter class name",
          required: true,
          validation: {
            minLength: 1,
            messages: {
              required: "Name is required",
            },
          },
        },
      ],
      showResetButton: false,
      submitButtonText: classesDict.createButton || "Create Class",
      isLoading,
    }),
    [isLoading, classesDict],
  );

  const handleSubmit = async (data: Record<string, unknown>) => {
    try {
      const payload: CreateClassInput = {
        name: data.name as string,
      };
      await onSubmit(payload);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create class:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn("sm:max-w-[500px]", isRTL && "rtl:text-start")}
        dir={direction}
      >
        <DialogHeader className="border-b pb-2">
          <DialogTitle>{classesDict.createTitle || "Create New Class"}</DialogTitle>
          <DialogDescription>
            {classesDict.createDescription || "Fill in the information below to create a new class."}
          </DialogDescription>
        </DialogHeader>

        <div
          className={cn(
            "max-h-[70vh] overflow-y-auto",
            isRTL && "rtl:text-start",
          )}
        >
          <DynamicForm definition={formDefinition} onSubmit={handleSubmit} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

