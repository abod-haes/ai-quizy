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
import type { CreateSubjectInput } from "@/services/subject.services/subject.type";
import { useTranslation } from "@/providers/TranslationsProvider";
import { useClassesBrief } from "@/services/classes.services/classes.query";

interface CreateSubjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateSubjectInput) => Promise<void>;
  isLoading?: boolean;
}

export function CreateSubjectDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
}: CreateSubjectDialogProps) {
  const lang = useCurrentLang();
  const direction = getDirection(lang);
  const isRTL = direction === "rtl";
  const t = useTranslation();
  const subjectsDict = t.dashboard.subjects;

  const { data: classesData } = useClassesBrief();

  const classesOptions = React.useMemo(() => {
    if (!classesData) return [];
    return classesData.map((classItem) => ({
      label: classItem.name,
      value: classItem.id,
    }));
  }, [classesData]);

  const formDefinition: FormDefinition = React.useMemo(
    () => ({
      id: "create-subject-form",
      fields: [
        {
          key: "name",
          type: "text",
          label: "Name",
          placeholder: "Enter subject name",
          required: true,
          validation: {
            minLength: 1,
            messages: {
              required: "Name is required",
            },
          },
        },
        {
          key: "classIds",
          type: "multiselect",
          label: subjectsDict.classes || "Classes",
          required: false,
          options: classesOptions,
        },
      ],
      showResetButton: false,
      submitButtonText: subjectsDict.createButton || "Create Subject",
      isLoading,
    }),
    [isLoading, subjectsDict, classesOptions],
  );

  const handleSubmit = async (data: Record<string, unknown>) => {
    try {
      const payload: CreateSubjectInput = {
        name: data.name as string,
        classIds: Array.isArray(data.classIds) ? (data.classIds as string[]) : [],
      };
      await onSubmit(payload);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create subject:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn("sm:max-w-[500px]", isRTL && "rtl:text-start")}
        dir={direction}
      >
        <DialogHeader className="border-b pb-2">
          <DialogTitle>{subjectsDict.createTitle || "Create New Subject"}</DialogTitle>
          <DialogDescription>
            {subjectsDict.createDescription || "Fill in the information below to create a new subject."}
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

