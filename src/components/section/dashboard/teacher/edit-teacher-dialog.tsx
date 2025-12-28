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
import { useClassesBrief } from "@/services/classes.services/classes.query";
import { useSubjectsBrief } from "@/services/subject.services/subject.query";
import type {
  Teacher,
  CreateTeacherInput,
} from "@/services/teacher.services/teacher.type";

interface EditTeacherDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teacher: Teacher | null;
  onSubmit: (data: CreateTeacherInput) => Promise<void>;
  isLoading?: boolean;
}

export function EditTeacherDialog({
  open,
  onOpenChange,
  teacher,
  onSubmit,
  isLoading = false,
}: EditTeacherDialogProps) {
  const lang = useCurrentLang();
  const direction = getDirection(lang);
  const isRTL = direction === "rtl";

  const { data: classesData } = useClassesBrief();
  const { data: subjectsData } = useSubjectsBrief();

  const classesOptions = React.useMemo(() => {
    if (!classesData) return [];
    const classesArray = Array.isArray(classesData)
      ? classesData
      : [classesData];
    return classesArray.map((cls) => ({ label: cls.name, value: cls.id }));
  }, [classesData]);

  const subjectsOptions = React.useMemo(() => {
    if (!subjectsData) return [];
    return subjectsData.map((subject) => ({
      label: subject.name,
      value: subject.id,
    }));
  }, [subjectsData]);

  const formDefinition: FormDefinition = React.useMemo(
    () => ({
      id: "edit-teacher-form",
      fields: [
        {
          key: "firstName",
          type: "text",
          label: "First Name",
          placeholder: "Enter first name",
          required: true,
          validation: {
            minLength: 1,
            messages: {
              required: "First name is required",
            },
          },
        },
        {
          key: "lastName",
          type: "text",
          label: "Last Name",
          placeholder: "Enter last name",
          required: true,
          validation: {
            minLength: 1,
            messages: {
              required: "Last name is required",
            },
          },
        },
        {
          key: "phoneNumber",
          type: "text",
          label: "Phone Number",
          placeholder: "Enter phone number",
          required: true,
          validation: {
            minLength: 1,
            messages: {
              required: "Phone number is required",
            },
          },
        },
        {
          key: "description",
          type: "textarea",
          label: "Description",
          placeholder: "Enter description",
          required: true,
          validation: {
            minLength: 1,
            messages: {
              required: "Description is required",
            },
          },
        },
        {
          key: "url",
          type: "text",
          label: "URL",
          placeholder: "Enter URL (e.g., http://example.com)",
          required: false,
        },
        {
          key: "classSubjects",
          type: "array",
          label: "Class Subjects",
          required: true,
          fields: [
            {
              key: "subjectId",
              type: "select",
              label: "Subject",
              placeholder: "Select subject",
              required: true,
              options: subjectsOptions,
              validation: {
                messages: {
                  required: "Subject is required",
                },
              },
            },
            {
              key: "classId",
              type: "select",
              label: "Class",
              placeholder: "Select class",
              required: true,
              options: classesOptions,
              validation: {
                messages: {
                  required: "Class is required",
                },
              },
            },
          ],
          validation: {
            messages: {
              required: "At least one class subject is required",
            },
          },
        },
      ],
      showResetButton: false,
    }),
    [classesOptions, subjectsOptions],
  );

  const formDefinitionWithDefaults = React.useMemo(() => {
    if (!teacher) return formDefinition;

    return {
      ...formDefinition,
      submitButtonText: "Save Changes",
      isLoading,
      fields: formDefinition.fields.map((field) => {
        if (field.key === "classSubjects") {
          const classSubjects =
            (teacher as Teacher).classSubjects ||
            (teacher as Teacher).classSubject ||
            [];
          return {
            ...field,
            default: Array.isArray(classSubjects) ? classSubjects : [],
          };
        }
        return {
          ...field,
          default: (teacher as Teacher)[field.key] || "",
        };
      }),
    };
  }, [formDefinition, teacher, isLoading]);

  const handleSubmit = async (data: Record<string, unknown>) => {
    if (!teacher) return;

    try {
      const payload: CreateTeacherInput = {
        firstName: data.firstName as string,
        lastName: data.lastName as string,
        phoneNumber: data.phoneNumber as string,
        description: data.description as string,
        url: data.url as string,
        classSubjects: Array.isArray(data.classSubjects)
          ? (data.classSubjects as CreateTeacherInput["classSubjects"])
          : [],
      };
      await onSubmit(payload);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update teacher:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn("sm:max-w-[650px]", isRTL && "rtl:text-start")}
        dir={direction}
      >
        <DialogHeader className="border-b pb-2">
          <DialogTitle>Edit Teacher</DialogTitle>
          <DialogDescription>
            Update the teacher information below.
          </DialogDescription>
        </DialogHeader>

        <div
          className={cn(
            "max-h-[70vh] overflow-y-auto",
            isRTL && "rtl:text-start",
          )}
        >
          {teacher ? (
            <DynamicForm
              definition={formDefinitionWithDefaults}
              onSubmit={handleSubmit}
            />
          ) : (
            <div className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">Loading teacher data...</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
