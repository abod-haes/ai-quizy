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
import type { CreateSubjectInput, Subject } from "@/services/subject.services/subject.type";
import { useTranslation } from "@/providers/TranslationsProvider";
import { useClassesBrief } from "@/services/classes.services/classes.query";

interface EditSubjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subject: Subject | null;
  onSubmit: (data: CreateSubjectInput) => Promise<void>;
  isLoading?: boolean;
}

export function EditSubjectDialog({
  open,
  onOpenChange,
  subject,
  onSubmit,
  isLoading = false,
}: EditSubjectDialogProps) {
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

  // Get current classIds from subject if available
  const currentClassIds = React.useMemo(() => {
    // Note: The API might return subjects array on the class, not classIds on the subject
    // This depends on the actual API response structure
    return [];
  }, []);

  const formDefinition: FormDefinition = React.useMemo(
    () => ({
      id: "edit-subject-form",
      fields: [
        {
          key: "name",
          type: "text",
          label: "Name",
          placeholder: "Enter subject name",
          required: true,
          defaultValue: subject?.name || "",
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
          default: currentClassIds,
        },
      ],
      showResetButton: false,
      submitButtonText: subjectsDict.editButton || "Update Subject",
      isLoading,
    }),
    [isLoading, subject, subjectsDict, classesOptions, currentClassIds],
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
      console.error("Failed to update subject:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn("sm:max-w-[500px]", isRTL && "rtl:text-start")}
        dir={direction}
      >
        <DialogHeader className="border-b pb-2">
          <DialogTitle>{subjectsDict.editTitle || "Edit Subject"}</DialogTitle>
          <DialogDescription>
            {subjectsDict.editDescription || "Update the information below to edit the subject."}
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

