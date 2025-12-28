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
import { useSubjectsBrief } from "@/services/subject.services/subject.query";
import type { CreateUnitInput } from "@/services/unit.services/unit.type";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useLocalizedHref } from "@/hooks/useLocalizedHref";
import { dashboardRoutesName } from "@/utils/constant";
import { useTranslation } from "@/providers/TranslationsProvider";
import { AlertCircle } from "lucide-react";

interface CreateUnitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateUnitInput) => Promise<void>;
  isLoading?: boolean;
}

export function CreateUnitDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
}: CreateUnitDialogProps) {
  const lang = useCurrentLang();
  const direction = getDirection(lang);
  const isRTL = direction === "rtl";
  const router = useRouter();
  const getLocalizedHref = useLocalizedHref();
  const t = useTranslation();
  const unitsDict = t.dashboard.units;
  const subjectsDict = t.dashboard.subjects;
  const common = t.dashboard.common;

  const { data: subjectsData } = useSubjectsBrief();

  const subjectsOptions = React.useMemo(() => {
    if (!subjectsData) return [];
    return subjectsData.map((subject) => ({
      label: subject.name,
      value: subject.id,
    }));
  }, [subjectsData]);

  const hasSubjects = subjectsData && subjectsData.length > 0;

  const formDefinition: FormDefinition = React.useMemo(
    () => ({
      id: "create-unit-form",
      fields: [
        {
          key: "name",
          type: "text",
          label: unitsDict.name || "Name",
          placeholder: unitsDict.namePlaceholder || "Enter unit name",
          required: true,
          validation: {
            minLength: 1,
            messages: {
              required: unitsDict.nameRequired || "Name is required",
            },
          },
        },
        {
          key: "desc",
          type: "textarea",
          label: unitsDict.description || common.description || "Description",
          placeholder: unitsDict.descriptionPlaceholder || "Enter description",
          required: false,
        },
        {
          key: "subjectId",
          type: "select",
          label: unitsDict.subject || "Subject",
          placeholder: unitsDict.subjectPlaceholder || "Select subject",
          required: true,
          options: subjectsOptions,
          validation: {
            messages: {
              required: unitsDict.subjectRequired || "Subject is required",
            },
          },
        },
      ],
      showResetButton: false,
      submitButtonText: unitsDict.createButton || "Create Unit",
      isLoading,
    }),
    [isLoading, subjectsOptions, unitsDict, common],
  );

  const handleSubmit = async (data: Record<string, unknown>) => {
    try {
      const payload: CreateUnitInput = {
        name: data.name as string,
        desc: data.desc as string,
        subjectId: data.subjectId as string,
      };
      await onSubmit(payload);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create unit:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn("sm:max-w-[500px]", isRTL && "rtl:text-start")}
        dir={direction}
      >
        <DialogHeader className="border-b pb-2">
          <DialogTitle>{unitsDict.createTitle || "Create New Unit"}</DialogTitle>
          <DialogDescription>
            {unitsDict.createDescription ||
              "Fill in the information below to create a new unit."}
          </DialogDescription>
        </DialogHeader>

        <div
          className={cn(
            "max-h-[70vh] overflow-y-auto",
            isRTL && "rtl:text-start",
          )}
        >
          {!hasSubjects ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <AlertCircle className="h-12 w-12 text-muted-foreground" />
              <div className="text-center space-y-2">
                <p className="font-medium">
                  {subjectsDict.noSubjectsMessage || "No subjects found"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {subjectsDict.noSubjectsDescription ||
                    "You need to create at least one subject before creating a unit."}
                </p>
              </div>
              <Button
                onClick={() => {
                  onOpenChange(false);
                  router.push(getLocalizedHref(dashboardRoutesName.subjects.href));
                }}
                className="mt-4"
              >
                {subjectsDict.goToSubjects || "Go to Subjects"}
              </Button>
            </div>
          ) : (
            <DynamicForm definition={formDefinition} onSubmit={handleSubmit} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

