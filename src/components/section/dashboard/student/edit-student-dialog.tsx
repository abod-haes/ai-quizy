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
import type { Student } from "@/services/student.services/student.type";

interface EditStudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student | null;
  onSubmit: (data: Student) => Promise<void>;
  isLoading?: boolean;
}

export function EditStudentDialog({
  open,
  onOpenChange,
  student,
  onSubmit,
  isLoading = false,
}: EditStudentDialogProps) {
  const lang = useCurrentLang();
  const direction = getDirection(lang);
  const isRTL = direction === "rtl";

  const formDefinition: FormDefinition = React.useMemo(
    () => ({
      id: "edit-student-form",
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
          key: "email",
          type: "email",
          label: "Email",
          placeholder: "Enter email address",
          required: true,
          validation: {
            messages: {
              required: "Email is required",
              email: "Invalid email address",
            },
          },
        },
        {
          key: "password",
          type: "password",
          label: "Password",
          placeholder: "Enter new password (leave empty to keep current)",
          required: false,
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
      ],
      showResetButton: false,
    }),
    [],
  );

  // Update default values when student changes
  const formDefinitionWithDefaults = React.useMemo(() => {
    if (!student) return formDefinition;

    return {
      ...formDefinition,
      submitButtonText: "Save Changes",
      isLoading,
      fields: formDefinition.fields.map((field) => {
        // Don't set default value for password field (leave empty for optional update)
        if (field.key === "password") {
          return {
            ...field,
            default: "",
          };
        }
        return {
          ...field,
          default: student[field.key as keyof Student] || "",
        };
      }),
    };
  }, [formDefinition, student, isLoading]);

  const handleSubmit = async (data: Record<string, unknown>) => {
    if (!student) return;

    try {
      // Remove password from data if it's empty (don't update password)
      const submitData = { ...data };
      if (!submitData.password || String(submitData.password).trim() === "") {
        delete submitData.password;
      }

      await onSubmit({
        ...submitData,
      } as Student);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update student:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn("sm:max-w-[650px]", isRTL && "rtl:text-right")}
        dir={direction}
      >
        <DialogHeader className="border-b pb-2">
          <DialogTitle>Edit Student</DialogTitle>
          <DialogDescription>
            Update the student information below.
          </DialogDescription>
        </DialogHeader>

        <div
          className={cn(
            "max-h-[70vh] overflow-y-auto",
            isRTL && "rtl:text-right",
          )}
        >
          {student ? (
            <DynamicForm
              definition={formDefinitionWithDefaults}
              onSubmit={handleSubmit}
            />
          ) : (
            <div className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">Loading student data...</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
