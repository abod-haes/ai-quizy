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
import type { CreateLessonInput } from "@/services/lesson.services/lesson.type";
import { useTranslation } from "@/providers/TranslationsProvider";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Code2, FileText } from "lucide-react";
import { toast } from "sonner";
import { useCreateLessonsList } from "@/services/lesson.services/lesson.query";

interface CreateLessonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateLessonInput) => Promise<void>;
  onSubmitList?: (data: CreateLessonInput[]) => Promise<void>;
  isLoading?: boolean;
}

export function CreateLessonDialog({
  open,
  onOpenChange,
  onSubmit,
  onSubmitList,
  isLoading = false,
}: CreateLessonDialogProps) {
  const lang = useCurrentLang();
  const direction = getDirection(lang);
  const isRTL = direction === "rtl";
  const t = useTranslation();
  const lessonsDict = t.dashboard.lessons;
  const common = t.dashboard.common;
  const [isJsonMode, setIsJsonMode] = React.useState(false);
  const [jsonValue, setJsonValue] = React.useState("");
  const [isListMode, setIsListMode] = React.useState(false);
  const createLessonsList = useCreateLessonsList();

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
      id: "create-lesson-form",
      fields: [
        {
          key: "name",
          type: "text",
          label: lessonsDict.name,
          placeholder: lessonsDict.namePlaceholder,
          required: true,
          validation: {
            minLength: 1,
            messages: {
              required: lessonsDict.nameRequired,
            },
          },
        },
        {
          key: "desc",
          type: "textarea",
          label: lessonsDict.description || common.description,
          placeholder: lessonsDict.descriptionPlaceholder,
          required: false,
        },
        {
          key: "unitId",
          type: "select",
          label: lessonsDict.unit,
          placeholder: lessonsDict.unitPlaceholder,
          required: true,
          options: unitsOptions,
          validation: {
            messages: {
              required: lessonsDict.unitRequired,
            },
          },
        },
      ],
      showResetButton: false,
      submitButtonText: lessonsDict.createButton,
      isLoading,
    }),
    [isLoading, unitsOptions, lessonsDict, common],
  );

  const handleSubmit = async (data: Record<string, unknown>) => {
    try {
      const payload: CreateLessonInput = {
        name: data.name as string,
        desc: data.desc as string,
        unitId: data.unitId as string,
      };
      await onSubmit(payload);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create lesson:", error);
    }
  };

  const handleJsonSubmit = async () => {
    try {
      // Parse JSON to validate it, but send the parsed object as-is
      const parsed = JSON.parse(jsonValue);

      if (isListMode) {
        // Send as array/list
        if (!Array.isArray(parsed)) {
          toast.error("JSON must be an array when sending as list");
          return;
        }
        if (onSubmitList) {
          await onSubmitList(parsed as CreateLessonInput[]);
        } else {
          await createLessonsList.mutateAsync(parsed as CreateLessonInput[]);
        }
      } else {
        // Send as single object
        if (Array.isArray(parsed)) {
          toast.error("JSON must be an object when sending as single");
          return;
        }
        await onSubmit(parsed as CreateLessonInput);
      }

      onOpenChange(false);
      setJsonValue("");
      setIsListMode(false);
    } catch (error) {
      toast.error(lessonsDict.invalidJson);
      console.error("Invalid JSON:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn("sm:max-w-[500px]", isRTL && "rtl:text-start")}
        dir={direction}
      >
        <DialogHeader className="border-b pb-2">
          <div className="mt-4 flex items-center justify-between">
            <div>
              <DialogTitle>{lessonsDict.createTitle}</DialogTitle>
              <DialogDescription>
                {lessonsDict.createDescription}
              </DialogDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setIsJsonMode(!isJsonMode);
                if (!isJsonMode) {
                  // Initialize with single object template
                  setJsonValue(
                    JSON.stringify(
                      {
                        name: "",
                        desc: "",
                        unitId: "",
                      },
                      null,
                      2,
                    ),
                  );
                  setIsListMode(false);
                } else {
                  setJsonValue("");
                }
              }}
              className="gap-2"
            >
              {isJsonMode ? (
                <>
                  <FileText className="size-4" />
                  {lessonsDict.switchToForm}
                </>
              ) : (
                <>
                  <Code2 className="size-4" />
                  {lessonsDict.switchToJson}
                </>
              )}
            </Button>
          </div>
        </DialogHeader>

        <div
          className={cn(
            "max-h-[70vh] overflow-y-auto",
            isRTL && "rtl:text-start",
          )}
        >
          {isJsonMode ? (
            <div className="space-y-4 p-4">
              <div
                className={cn(
                  "flex items-center justify-between rounded-lg border p-3",
                  isRTL && "flex-row-reverse",
                )}
              >
                <div
                  className={cn(
                    "flex items-center gap-3",
                    isRTL && "flex-row-reverse",
                  )}
                >
                  <Label
                    htmlFor="list-mode"
                    className={cn("cursor-pointer", isRTL && "rtl:text-right")}
                  >
                    {isListMode
                      ? lessonsDict.sendAsList
                      : lessonsDict.sendAsSingle}
                  </Label>
                  <Switch
                    id="list-mode"
                    checked={isListMode}
                    onCheckedChange={(checked) => {
                      setIsListMode(checked);
                      // Update JSON template based on mode
                      if (checked) {
                        // Switch to array template
                        setJsonValue(
                          JSON.stringify(
                            [
                              {
                                name: "",
                                desc: "",
                                unitId: "",
                              },
                            ],
                            null,
                            2,
                          ),
                        );
                      } else {
                        // Switch to single object template
                        setJsonValue(
                          JSON.stringify(
                            {
                              name: "",
                              desc: "",
                              unitId: "",
                            },
                            null,
                            2,
                          ),
                        );
                      }
                    }}
                  />
                </div>
              </div>
              <Textarea
                value={jsonValue}
                onChange={(e) => setJsonValue(e.target.value)}
                placeholder={lessonsDict.jsonPlaceholder}
                className="font-mono text-sm ltr:text-start"
                rows={12}
                dir="ltr"
              />
              <Button
                onClick={handleJsonSubmit}
                disabled={
                  isLoading || createLessonsList.isPending || !jsonValue.trim()
                }
                className="w-full"
              >
                {isLoading || createLessonsList.isPending
                  ? t.form.submitting
                  : lessonsDict.createButton}
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
