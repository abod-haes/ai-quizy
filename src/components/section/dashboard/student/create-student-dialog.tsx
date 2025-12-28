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

interface CreateStudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<Student, "id">) => Promise<void>;
  isLoading?: boolean;
}

export function CreateStudentDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
}: CreateStudentDialogProps) {
  const lang = useCurrentLang();
  const direction = getDirection(lang);
  const isRTL = direction === "rtl";

  const formDefinition: FormDefinition = React.useMemo(
    () => ({
      id: "create-student-form",
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
          placeholder: "Enter password",
          required: true,
          validation: {
            minLength: 8,
            messages: {
              required: "Password is required",
              minLength: "Password must be at least 8 characters",
              pattern:
                "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
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
      ],
      showResetButton: false,
      submitButtonText: "Create Student",
      isLoading,
    }),
    [isLoading],
  );

  const handleSubmit = async (data: Record<string, unknown>) => {
    try {
      await onSubmit(data as Omit<Student, "id">);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create student:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn("sm:max-w-[650px]", isRTL && "rtl:text-start")}
        dir={direction}
      >
        <DialogHeader className="border-b pb-2">
          <DialogTitle>Create New Student</DialogTitle>
          <DialogDescription>
            Fill in the information below to create a new student.
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
