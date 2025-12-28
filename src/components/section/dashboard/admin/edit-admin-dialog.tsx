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
import type { User, UserInput } from "@/services/user.services/user.type";
import { useTranslation } from "@/providers/TranslationsProvider";
import { roleType } from "@/utils/enum/common.enum";
import { COUNTRY_CALLING_CODES } from "@/components/custom/phone-select";
import type { Option } from "@/components/form-render/form-render";

interface EditAdminDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  admin: User | null;
  onSubmit: (data: UserInput) => Promise<void>;
  isLoading?: boolean;
}

export function EditAdminDialog({
  open,
  onOpenChange,
  admin,
  onSubmit,
  isLoading = false,
}: EditAdminDialogProps) {
  const lang = useCurrentLang();
  const direction = getDirection(lang);
  const isRTL = direction === "rtl";
  const t = useTranslation();
  const common = t.dashboard?.common || {};

  const formDefinition: FormDefinition = React.useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const admin = (t.dashboard as any)?.administration || {};
    return {
      id: "edit-admin-form",
      fields: [
        {
          key: "firstName",
          type: "text",
          label: common.firstName || "First Name",
          placeholder: common.enterFirstName || "Enter first name",
          required: true,
          validation: {
            minLength: 1,
          },
        },
        {
          key: "lastName",
          type: "text",
          label: common.lastName || "Last Name",
          placeholder: common.enterLastName || "Enter last name",
          required: true,
          validation: {
            minLength: 1,
          },
        },
        {
          key: "email",
          type: "email",
          label: common.email || "Email",
          placeholder: common.enterEmail || "Enter email address",
          required: true,
          validation: {},
        },
        {
          key: "password",
          type: "password",
          label: common.password || "Password",
          placeholder: common.enterNewPassword || "Enter new password (leave empty to keep current)",
          required: false,
        },
        {
          key: "phoneGroup",
          type: "group",
          label: common.phoneNumber || "Phone Number",
          fields: [
            {
              key: "countryCallingCode",
              type: "select",
              placeholder: common.countryCode || "Country Code",
              required: false,
              default: "+963",
              options: Array.from(
                new Set(Object.values(COUNTRY_CALLING_CODES)),
              ).map((code) => ({
                label: code,
                value: code,
              })) as Option[],
            },
            {
              key: "phoneNumber",
              type: "text",
              placeholder: common.enterPhoneNumber || "Enter phone number",
              required: false,
            },
          ],
        },
        {
          key: "url",
          type: "text",
          label: common.url || "URL",
          placeholder: common.enterUrl || "Enter URL (optional)",
          required: false,
        },
      ],
      showResetButton: false,
      submitButtonText: admin.editButton || "Update Admin",
      isLoading,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, common]);

  // Update default values when admin changes
  const formDefinitionWithDefaults = React.useMemo(() => {
    if (!admin) return formDefinition;

    return {
      ...formDefinition,
      fields: formDefinition.fields.map((field) => {
        if (field.type === "group" && field.fields) {
          return {
            ...field,
            fields: field.fields.map((groupField) => {
              const adminValue = admin[groupField.key as keyof User];
              let defaultValue = groupField.default;
              
              if (adminValue !== undefined && adminValue !== null) {
                // Add + to countryCallingCode if it doesn't have it
                if (groupField.key === "countryCallingCode") {
                  const codeValue = String(adminValue);
                  defaultValue = codeValue.startsWith("+") ? codeValue : `+${codeValue}`;
                } else {
                  defaultValue = String(adminValue);
                }
              }
              
              return {
                ...groupField,
                default: defaultValue,
              };
            }),
          };
        }
        const adminValue = admin[field.key as keyof User];
        let defaultValue = field.default;
        
        if (adminValue !== undefined && adminValue !== null) {
          defaultValue = String(adminValue);
        }
        
        return {
          ...field,
          default: defaultValue,
        };
      }),
    };
  }, [formDefinition, admin]);

  const handleSubmit = async (data: Record<string, unknown>) => {
    try {
      // Always set role to ADMIN (3)
      // Ensure countryCallingCode has + prefix
      let countryCode = (data.countryCallingCode as string) || "+963";
      if (countryCode && !countryCode.startsWith("+")) {
        countryCode = `+${countryCode}`;
      }
      
      const adminData: UserInput = {
        firstName: data.firstName as string,
        lastName: data.lastName as string,
        email: data.email as string,
        phoneNumber: data.phoneNumber as string | undefined,
        countryCallingCode: countryCode,
        role: roleType.ADMIN,
        description: "",
        url: data.url as string | undefined,
      };
      // Only include password if provided
      if (data.password && (data.password as string).trim()) {
        adminData.password = data.password as string;
      }
      await onSubmit(adminData);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update admin:", error);
    }
  };

  if (!admin) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn("sm:max-w-[650px]", isRTL && "rtl:text-start")}
        dir={direction}
      >
        <DialogHeader className="border-b pb-2">
          <DialogTitle>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {(t.dashboard as any)?.administration?.editTitle || "Edit Admin"}
          </DialogTitle>
          <DialogDescription>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {(t.dashboard as any)?.administration?.editDescription ||
              "Update the information below to edit this administrator."}
          </DialogDescription>
        </DialogHeader>

        <div
          className={cn(
            "max-h-[70vh] overflow-y-auto",
            isRTL && "rtl:text-start",
          )}
        >
          <DynamicForm
            definition={formDefinitionWithDefaults}
            onSubmit={handleSubmit}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

