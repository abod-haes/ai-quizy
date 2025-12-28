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
import { useUnits } from "@/services/unit.services/unit.query";
import type { Lesson, CreateLessonInput } from "@/services/lesson.services/lesson.type";
import { useTranslation } from "@/providers/TranslationsProvider";

interface EditLessonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lesson: Lesson | null;
  onSubmit: (data: CreateLessonInput) => Promise<void>;
  isLoading?: boolean;
}

export function EditLessonDialog({
  open,
  onOpenChange,
  lesson,
  onSubmit,
  isLoading = false,
}: EditLessonDialogProps) {
  const lang = useCurrentLang();
  const direction = getDirection(lang);
  const isRTL = direction === "rtl";
  const t = useTranslation();
  const lessonsDict = t.dashboard.lessons;
  const common = t.dashboard.common;

  // Fetch all units for the dropdown (with high PerPage to get all)
  const { data: unitsData } = useUnits({ page: 1, PerPage: 1000 });

  const unitsOptions = React.useMemo(() => {
    if (!unitsData?.items) return [];
    return unitsData.items.map((unit) => ({
      label: unit.name,
      value: unit.id,
    }));
  }, [unitsData]);

  const formDefinition: FormDefinition = React.useMemo(
    () => ({
      id: "edit-lesson-form",
      fields: [
        {
          key: "name",
          type: "text",
          label: lessonsDict.name || "Name",
          placeholder: lessonsDict.namePlaceholder || "Enter lesson name",
          required: true,
          validation: {
            minLength: 1,
            messages: {
              required: lessonsDict.nameRequired || "Name is required",
            },
          },
        },
        {
          key: "desc",
          type: "textarea",
          label: lessonsDict.description || common.description || "Description",
          placeholder: lessonsDict.descriptionPlaceholder || "Enter description",
          required: false,
        },
        {
          key: "unitId",
          type: "select",
          label: lessonsDict.unit || "Unit",
          placeholder: lessonsDict.unitPlaceholder || "Select unit",
          required: true,
          options: unitsOptions,
          validation: {
            messages: {
              required: lessonsDict.unitRequired || "Unit is required",
            },
          },
        },
      ],
      showResetButton: false,
    }),
    [unitsOptions, lessonsDict, common],
  );

  const formDefinitionWithDefaults = React.useMemo(() => {
    if (!lesson) return formDefinition;

    return {
      ...formDefinition,
      submitButtonText: lessonsDict.editButton || "Save Changes",
      isLoading,
      fields: formDefinition.fields.map((field) => {
        if (field.key === "desc") {
          return {
            ...field,
            default: lesson.description || "",
          };
        }
        return {
          ...field,
          default: lesson[field.key] || "",
        };
      }),
    };
  }, [formDefinition, lesson, isLoading, lessonsDict]);

  const handleSubmit = async (data: Record<string, unknown>) => {
    if (!lesson) return;

    try {
      const payload: CreateLessonInput = {
        name: data.name as string,
        desc: data.desc as string,
        unitId: data.unitId as string,
      };
      await onSubmit(payload);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update lesson:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn("sm:max-w-[500px]", isRTL && "rtl:text-start")}
        dir={direction}
      >
        <DialogHeader className="border-b pb-2">
          <DialogTitle>{lessonsDict.editTitle || "Edit Lesson"}</DialogTitle>
          <DialogDescription>
            {lessonsDict.editDescription ||
              "Update the lesson information below."}
          </DialogDescription>
        </DialogHeader>

        <div
          className={cn(
            "max-h-[70vh] overflow-y-auto",
            isRTL && "rtl:text-start",
          )}
        >
          {lesson ? (
            <DynamicForm
              definition={formDefinitionWithDefaults}
              onSubmit={handleSubmit}
            />
          ) : (
            <div className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">
                {lessonsDict.loadingLessonData || "Loading lesson data..."}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

