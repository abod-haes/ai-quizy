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
import type { CreateQuestionInput } from "@/services/question.services/question.type";
import { useTranslation } from "@/providers/TranslationsProvider";
import { useLessons } from "@/services/lesson.services/lesson.query";

interface CreateQuestionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateQuestionInput) => Promise<void>;
  isLoading?: boolean;
}

export function CreateQuestionDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
}: CreateQuestionDialogProps) {
  const lang = useCurrentLang();
  const direction = getDirection(lang);
  const isRTL = direction === "rtl";
  const t = useTranslation();
  const questionsDict = t.dashboard.questions;
  const common = t.dashboard.common;
  const formDict = t.form;

  // Fetch all lessons for the dropdown (with high PerPage to get all)
  const { data: lessonsData } = useLessons({ page: 1, PerPage: 1000 });

  const lessonsOptions = React.useMemo(() => {
    if (!lessonsData?.items) return [];
    return lessonsData.items.map((lesson) => ({
      label: lesson.name,
      value: lesson.id,
    }));
  }, [lessonsData]);

  const formDefinition: FormDefinition = React.useMemo(
    () => ({
      id: "create-question-form",
      fields: [
        {
          key: "title",
          type: "text",
          label: questionsDict?.titleLabel || "Title",
          placeholder:
            questionsDict?.titlePlaceholder || "Enter question title",
          required: true,
          validation: {
            minLength: 1,
            messages: {
              required: formDict?.validation?.required || "Title is required",
            },
          },
        },
        {
          key: "hint",
          type: "text",
          label: questionsDict?.hint || "Hint",
          placeholder: questionsDict?.hintPlaceholder || "Enter hint",
          required: false,
        },
        {
          key: "description",
          type: "textarea",
          label: questionsDict?.description || "Description",
          placeholder:
            questionsDict?.descriptionPlaceholder || "Enter description",
          required: true,
          validation: {
            minLength: 1,
            messages: {
              required:
                formDict?.validation?.required || "Description is required",
            },
          },
        },
        {
          key: "lessonIds",
          type: "multiselect",
          label: questionsDict?.lessons || "Lessons",
          required: true,
          options: lessonsOptions,
          validation: {
            messages: {
              required:
                formDict?.validation?.selectAtLeastOne ||
                "Select at least one lesson",
            },
          },
        },
        {
          key: "answers",
          type: "array",
          label: questionsDict?.answers || "Answers",
          required: true,
          default: [
            { title: "", isCorrect: false },
            { title: "", isCorrect: false },
          ],
          fields: [
            {
              key: "title",
              type: "text",
              label: questionsDict?.answerTitle || "Answer Text",
              placeholder:
                questionsDict?.answerTitlePlaceholder || "Enter answer text",
              required: true,
              default: "",
            },
            {
              key: "isCorrect",
              type: "checkbox",
              label: questionsDict?.isCorrect || "Is Correct",
              required: false,
              default: false,
            },
          ],
          validation: {
            minLength: 2,
            messages: {
              minLength:
                questionsDict?.minAnswers || "At least 2 answers are required",
            },
          },
        },
      ],
      showResetButton: false,
      submitButtonText:
        questionsDict?.createButton || common?.addEntity || "Create Question",
      isLoading,
    }),
    [isLoading, questionsDict, common, formDict, lessonsOptions],
  );

  const handleSubmit = async (data: Record<string, unknown>) => {
    // Ensure answers are properly formatted
    const formattedAnswers = Array.isArray(data.answers)
      ? (data.answers as Array<{ title?: string; isCorrect?: boolean }>)
          .filter(
            (answer) => answer.title && String(answer.title).trim() !== "",
          )
          .map((answer) => ({
            title: String(answer.title || "").trim(),
            isCorrect: Boolean(answer.isCorrect || false),
          }))
      : [];

    // Ensure lessonIds is an array of strings
    const formattedLessonIds = Array.isArray(data.lessonIds)
      ? (data.lessonIds as string[]).filter(
          (id) => id && String(id).trim() !== "",
        )
      : [];

    const payload: CreateQuestionInput = {
      title: String(data.title || "").trim(),
      hint: String(data.hint || "").trim(),
      description: String(data.description || "").trim(),
      lessonIds: formattedLessonIds,
      answers: formattedAnswers,
    };

    // Validate required fields
    if (!payload.title) {
      throw new Error(formDict?.validation?.required || "Title is required");
    }
    if (!payload.description) {
      throw new Error(
        formDict?.validation?.required || "Description is required",
      );
    }
    if (payload.lessonIds.length === 0) {
      throw new Error(
        formDict?.validation?.selectAtLeastOne ||
          "At least one lesson is required",
      );
    }
    if (payload.answers.length < 2) {
      throw new Error(
        questionsDict?.minAnswers || "At least 2 answers are required",
      );
    }

    await onSubmit(payload);
    onOpenChange(false);
  };

  if (!lessonsData || lessonsData.items.length === 0) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className={cn("sm:max-w-[500px]", isRTL && "rtl:text-start")}
          dir={direction}
        >
          <DialogHeader>
            <DialogTitle>
              {questionsDict?.createTitle || "Create Question"}
            </DialogTitle>
            <DialogDescription>
              {questionsDict?.noLessonsMessage ||
                "No lessons found. Please create lessons first."}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn("sm:max-w-[600px]", isRTL && "rtl:text-start")}
        dir={direction}
      >
        <DialogHeader>
          <DialogTitle>
            {questionsDict?.createTitle || "Create Question"}
          </DialogTitle>
          <DialogDescription>
            {questionsDict?.createDescription ||
              "Add a new question to the system"}
          </DialogDescription>
        </DialogHeader>
        <div className={cn("max-h-[70vh] overflow-y-auto", "rtl:text-start")}>
          <DynamicForm definition={formDefinition} onSubmit={handleSubmit} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
