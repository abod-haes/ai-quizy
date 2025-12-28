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
import type { UserInput } from "@/services/user.services/user.type";
import { useTranslation } from "@/providers/TranslationsProvider";
import { roleType } from "@/utils/enum/common.enum";
import { COUNTRY_CALLING_CODES } from "@/components/custom/phone-select";
import type { Option } from "@/components/form-render/form-render";

interface CreateAdminDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: UserInput) => Promise<void>;
  isLoading?: boolean;
}

export function CreateAdminDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
}: CreateAdminDialogProps) {
  const lang = useCurrentLang();
  const direction = getDirection(lang);
  const isRTL = direction === "rtl";
  const t = useTranslation();

  const formDefinition: FormDefinition = React.useMemo(() => {
    const common = t.dashboard?.common || {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const admin = (t.dashboard as any)?.administration || {};
    return {
      id: "create-admin-form",
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
          placeholder: common.enterPassword || "Enter password",
          required: true,
          validation: {
            minLength: 6,
          },
        },
        {
          key: "phoneGroup",
          type: "group",
          label: common.phoneNumber,
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
      submitButtonText: admin.createButton || "Create Admin",
      isLoading,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, t.dashboard?.common]);

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
        password: data.password as string,
        phoneNumber: data.phoneNumber as string | undefined,
        countryCallingCode: countryCode,
        role: roleType.ADMIN,
        description: "",
        url: data.url as string | undefined,
      };
      await onSubmit(adminData);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create admin:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn("sm:max-w-[650px]", isRTL && "rtl:text-start")}
        dir={direction}
      >
        <DialogHeader className="border-b pb-2">
          <DialogTitle>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {(t.dashboard as any)?.administration?.createTitle ||
              "Create New Admin"}
          </DialogTitle>
          <DialogDescription>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {(t.dashboard as any)?.administration?.createDescription ||
              "Fill in the information below to create a new administrator."}
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
