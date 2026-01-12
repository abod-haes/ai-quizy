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
import { useTeachersBrief } from "@/services/teacher.services/teacher.query";
import { useLessons } from "@/services/lesson.services/lesson.query";
import {
  useQuestions,
  useCreateQuestion,
} from "@/services/question.services/question.query";
import type {
  CreateQuizInput,
  QuizQuestionInput,
} from "@/services/quizes.services/quiz.type";
import { useTranslation } from "@/providers/TranslationsProvider";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Code2, FileText, Plus } from "lucide-react";
import { toast } from "sonner";
import { CreateQuestionDialog } from "@/components/section/dashboard/question/create-question-dialog";
import type { CreateQuestionInput } from "@/services/question.services/question.type";
import { useQueryClient } from "@tanstack/react-query";

interface CreateQuizDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateQuizInput) => Promise<void>;
  onSubmitList?: (data: CreateQuizInput[]) => Promise<void>;
  isLoading?: boolean;
}

export function CreateQuizDialog({
  open,
  onOpenChange,
  onSubmit,
  onSubmitList,
  isLoading = false,
}: CreateQuizDialogProps) {
  const lang = useCurrentLang();
  const direction = getDirection(lang); 
  const t = useTranslation();

  const quizzesDict = React.useMemo(() => {
    const dashboard = t.dashboard as Record<string, unknown>;
    return (dashboard.quizzes as Record<string, string>) || {};
  }, [t.dashboard]);

  const [isJsonMode, setIsJsonMode] =  React.useState(false);
  const [jsonValue, setJsonValue] = React.useState("");
  const [isListMode, setIsListMode] = React.useState(false);

  const [isCreateQuestionDialogOpen, setIsCreateQuestionDialogOpen] =
    React.useState(false);

  const formRef = React.useRef<{
    setValue: (name: string, value: unknown) => void;
    getValues: () => Record<string, unknown>;
  } | null>(null);

  const queryClient = useQueryClient();

  const createQuestion = useCreateQuestion();

  const previousQuestionsCount = React.useRef<number>(0);
  const newlyCreatedQuestionId = React.useRef<string | null>(null);

  const { data: teachersData } = useTeachersBrief();

  const { data: lessonsData } = useLessons({ page: 1, PerPage: 1000 });

  const { data: questionsData, refetch: refetchQuestions } = useQuestions({
    page: 1,
    PerPage: 1000,
  });

  React.useEffect(() => {
    if (questionsData?.items) {
      previousQuestionsCount.current = questionsData.items.length;
    }
  }, [questionsData]);

  React.useEffect(() => {
    if (questionsData?.items && newlyCreatedQuestionId.current) {
      const newQuestion = questionsData.items.find(
        (q) => q.id === newlyCreatedQuestionId.current,
      );

      if (newQuestion && formRef.current) {
        const currentValues = formRef.current.getValues();
        const currentQuestionIds = Array.isArray(currentValues.questionIds)
          ? (currentValues.questionIds as string[])
          : [];

        if (!currentQuestionIds.includes(newQuestion.id)) {
          formRef.current.setValue("questionIds", [
            ...currentQuestionIds,
            newQuestion.id,
          ]);

          const currentQuestionsWithAnswers = Array.isArray(
            currentValues.questionsWithAnswers,
          )
            ? currentValues.questionsWithAnswers
            : [];

          const existingIndex = currentQuestionsWithAnswers.findIndex(
            (q: { questionId?: string }) => q.questionId === newQuestion.id,
          );

          if (existingIndex === -1) {
            formRef.current.setValue("questionsWithAnswers", [
              ...currentQuestionsWithAnswers,
              {
                questionId: newQuestion.id,
                order: currentQuestionsWithAnswers.length,
                answers: newQuestion.answers.map((ans) => ({
                  title: ans.title,
                  isCorrect: ans.isCorrect,
                })),
              },
            ]);
          }

          toast.success("New question created and added to quiz");
          newlyCreatedQuestionId.current = null;
        }
      }
    }
  }, [questionsData]);

  const handleCreateQuestion = async (data: CreateQuestionInput) => {
    try {
      const createdQuestion = await createQuestion.mutateAsync(data);

      newlyCreatedQuestionId.current = createdQuestion.id;

      await queryClient.invalidateQueries({
        predicate: (query) => {
          return (
            query.queryKey[0] === "question" && query.queryKey[1] === "list"
          );
        },
      });
      await refetchQuestions();
      setIsCreateQuestionDialogOpen(false);
      toast.success("Question created successfully");
    } catch (error) {
      console.error("Failed to create question:", error);
      toast.error("Failed to create question");
    }
  };

  const teachersOptions = React.useMemo(() => {
    if (!teachersData) return [];
    return teachersData.map((teacher) => ({
      label: `${teacher.firstName} ${teacher.lastName}`,
      value: teacher.id,
    }));
  }, [teachersData]);

  const lessonsOptions = React.useMemo(() => {
    if (!lessonsData?.items) return [];
    return lessonsData.items.map((lesson) => ({
      label: lesson.name,
      value: lesson.id,
    }));
  }, [lessonsData]);

  const questionsOptions = React.useMemo(() => {
    if (!questionsData?.items) return [];
    return questionsData.items.map((question) => ({
      label: question.title || question.id,
      value: question.id,
    }));
  }, [questionsData]);

  const formDefinition: FormDefinition = React.useMemo(
    () => ({
      id: "create-quiz-form",
      fields: [
        {
          key: "teacherId",
          type: "select",
          label: quizzesDict.teacherLabel || "Teacher",
          placeholder: quizzesDict.teacherPlaceholder || "Select a teacher",
          required: true,
          options: teachersOptions,
          validation: {
            messages: {
              required: quizzesDict.teacherRequired || "Teacher is required",
            },
          },
        },
        {
          key: "timeExpiration",
          type: "number",
          label: quizzesDict.timeExpirationLabel || "Time Expiration (minutes)",
          placeholder:
            quizzesDict.timeExpirationPlaceholder || "Enter time in minutes",
          required: true,
          default: 0,
          validation: {
            min: 0,
            messages: {
              required:
                quizzesDict.timeExpirationRequired ||
                "Time expiration is required",
            },
          },
        },
        {
          key: "entityIds",
          type: "multiselect",
          label: quizzesDict.entityIdsLabel || "Lessons",
          placeholder: quizzesDict.entityIdsPlaceholder || "Select lessons",
          required: true,
          options: lessonsOptions,
          validation: {
            messages: {
              required:
                quizzesDict.entityIdsRequired ||
                "At least one lesson is required",
            },
          },
        },

        {
          key: "questionsWithAnswers",
          type: "array",
          label:
            quizzesDict.questionsWithAnswersLabel ||
            "Configure Questions with Answers",
          addButtonLabel: quizzesDict.addQuestion || "Add Question",
          required: true,
          default: [
            {
              questionId: "",
              order: 0,
              answers: [{ title: "", isCorrect: false }],
            },
          ],
          fields: [
            {
              key: "questionId",
              type: "select",
              label: quizzesDict.questionLabel || "Question",
              placeholder:
                quizzesDict.questionsPlaceholder || "Select a question",
              required: true,
              options: questionsOptions,
              default: "",
            },
            {
              key: "order",
              type: "number",
              label: quizzesDict.orderLabel || "Order",
              placeholder: quizzesDict.orderPlaceholder || "Enter order number",
              required: true,
              default: 0,
              validation: {
                min: 0,
                messages: {
                  required: quizzesDict.orderRequired || "Order is required",
                },
              },
            },
            {
              key: "answers",
              type: "array",
              label: quizzesDict.answersLabel || "Answers",
              addButtonLabel: quizzesDict.addAnswer || "Add Answer",
              required: true,
              default: [{ title: "", isCorrect: false }],
              fields: [
                {
                  key: "title",
                  type: "text",
                  //   label: quizzesDict.answerTitleLabel || "Answer Text",
                  placeholder:
                    quizzesDict.answerTitlePlaceholder || "Enter answer text",
                  required: true,
                  default: "",
                },
                {
                  key: "isCorrect",
                  type: "checkbox",
                  label: quizzesDict.isCorrectLabel || "Is Correct",
                  required: false,
                  default: false,
                },
              ],
              validation: {
                minLength: 1,
                messages: {
                  minLength:
                    quizzesDict.minAnswersRequired ||
                    "At least one answer is required",
                },
              },
            },
          ],
          validation: {
            minLength: 1,
            messages: {
              required:
                quizzesDict.questionsRequired ||
                "At least one question is required",
              minLength:
                quizzesDict.questionsRequired ||
                "At least one question is required",
            },
          },
        },
      ],
      showResetButton: false,
      submitButtonText: "Create Quiz",
      isLoading,
    }),
    [isLoading, teachersOptions, lessonsOptions, questionsOptions, quizzesDict],
  );

  const lessonNameToIdMap = React.useMemo(() => {
    if (!lessonsData?.items) return new Map<string, string>();
    const map = new Map<string, string>();
    lessonsData.items.forEach((lesson) => {
      map.set(lesson.name, lesson.id);
    });
    return map;
  }, [lessonsData]);

  const handleSubmit = async (data: Record<string, unknown>) => {
    try {
      const entityIds: string[] = Array.isArray(data.entityIds)
        ? (data.entityIds as string[]).filter((id) => id && id !== "")
        : [];

      if (entityIds.length === 0) {
        toast.error(
          quizzesDict.entityIdsRequired || "At least one lesson is required",
        );
        return;
      }

      const questionsWithAnswers = Array.isArray(data.questionsWithAnswers)
        ? (data.questionsWithAnswers as Array<{
            questionId?: string;
            order?: number;
            answers?: Array<{ title?: string; isCorrect?: boolean }>;
          }>)
        : [];

        const questionIds: string[] = questionsWithAnswers
        .map((q) => q.questionId)
        .filter((id): id is string => id !== undefined && id !== "");

      if (questionIds.length === 0) {
        toast.error(
          quizzesDict.questionsRequired || "At least one question is required",
        );
        return;
      }

      const selectedQuestions: QuizQuestionInput[] = questionIds
        .map((questionId) => {
          const question = questionsData?.items?.find(
            (q) => q.id === questionId,
          );
          if (!question) return null;

          const questionConfig = questionsWithAnswers.find(
            (q) => q.questionId === questionId,
          );

          const lessonIds = question.lessonNames
            ? question.lessonNames
                .map((lessonName) => lessonNameToIdMap.get(lessonName))
                .filter((id): id is string => id !== undefined)
            : [];

          const answers =
            questionConfig &&
            Array.isArray(questionConfig.answers) &&
            questionConfig.answers.length > 0
              ? questionConfig.answers
                  .filter((ans) => ans.title && String(ans.title).trim() !== "")
                  .map((ans) => ({
                    title: String(ans.title || "").trim(),
                    isCorrect: Boolean(ans.isCorrect || false),
                  }))
              : question.answers.map((answer) => ({
                  title: answer.title,
                  isCorrect: answer.isCorrect,
                }));

          if (answers.length === 0) {
            return null;
          }

          return {
            id: question.id,
            title: question.title,
            hint: question.hint || "",
            description: question.description || "",
            correctTitle: question.correctTitle || 0,
            lessonIds: lessonIds,
            answers: answers,
            order: questionConfig ? Number(questionConfig.order) || 0 : 0,
          };
        })
        .filter((q): q is QuizQuestionInput => q !== null);

      if (selectedQuestions.length === 0) {
        toast.error(
          quizzesDict.questionsRequired || "At least one question is required",
        );
        return;
      }

      const payload: CreateQuizInput = {
        teacherId: data.teacherId as string,
        timeExpiration: Number(data.timeExpiration) || 0,
        entityIds: entityIds,
        questions: selectedQuestions,
      };

      await onSubmit(payload);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create quiz:", error);
    }
  };

  const handleJsonSubmit = async () => {
    try {
      const parsed = JSON.parse(jsonValue);

      if (isListMode) {
        if (!Array.isArray(parsed)) {
          toast.error("JSON must be an array when sending as list");
          return;
        }
        if (onSubmitList) {
          await onSubmitList(parsed as CreateQuizInput[]);
        } else {
          for (const item of parsed as CreateQuizInput[]) {
            await onSubmit(item);
          }
        }
      } else {
        if (Array.isArray(parsed)) {
          toast.error("JSON must be an object when sending as single");
          return;
        }
        await onSubmit(parsed as CreateQuizInput);
      }

      onOpenChange(false);
      setJsonValue("");
      setIsListMode(false);
    } catch (error) {
      toast.error(quizzesDict.invalidJson || "Invalid JSON format");
      console.error("Invalid JSON:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn("sm:max-w-[600px]",   "rtl:text-start")}
        dir={direction}
      >
        <DialogHeader className="border-b pb-2">
          <div className="mt-4 flex items-center justify-between">
            <div>
              <DialogTitle>
                {quizzesDict.createTitle || "Create Quiz"}
              </DialogTitle>
              <DialogDescription>
                {quizzesDict.createDescription ||
                  "Add a new quiz to the system"}
              </DialogDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setIsJsonMode(!isJsonMode);
                if (!isJsonMode) {
                  setJsonValue(
                    JSON.stringify(
                      {
                        teacherId: "",
                        timeExpiration: 0,
                        entityIds: [],
                        questions: [
                          {
                            id: "",
                            title: "",
                            hint: "",
                            description: "",
                            correctTitle: 0,
                            lessonIds: [],
                            answers: [
                              {
                                title: "",
                                isCorrect: false,
                              },
                            ],
                            order: 0,
                          },
                        ],
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
                  {quizzesDict.switchToForm || "Switch to Form"}
                </>
              ) : (
                <>
                  <Code2 className="size-4" />
                  {quizzesDict.switchToJson || "Switch to JSON"}
                </>
              )}
            </Button>
          </div>
        </DialogHeader>

        <div
          className={cn(
            "max-h-[70vh] overflow-y-auto",
             "rtl:text-start",
          )}
        >
          {isJsonMode ? (
            <div className="space-y-4 p-4">
              <div
                className={cn(
                  "flex items-center justify-between rounded-lg border p-3",
                  "flex-row-reverse",
                )}
              >
                <div
                  className={cn(
                    "flex items-center gap-3",
                      "flex-row-reverse",
                  )}
                >
                  <Label
                    htmlFor="list-mode"
                    className={cn("cursor-pointer", "rtl:text-right")}
                  >
                    {isListMode
                      ? quizzesDict.sendAsList || "Send as List"
                      : quizzesDict.sendAsSingle || "Send as Single"}
                  </Label>
                  <Switch
                    id="list-mode"
                    checked={isListMode}
                    onCheckedChange={(checked) => {
                      setIsListMode(checked);
                      if (checked) {
                        setJsonValue(
                          JSON.stringify(
                            [
                              {
                                teacherId: "",
                                timeExpiration: 0,
                                entityIds: [],
                                questions: [
                                  {
                                    id: "",
                                    title: "",
                                    hint: "",
                                    description: "",
                                    correctTitle: 0,
                                    lessonIds: [],
                                    answers: [
                                      {
                                        title: "",
                                        isCorrect: false,
                                      },
                                    ],
                                    order: 0,
                                  },
                                ],
                              },
                            ],
                            null,
                            2,
                          ),
                        );
                      } else {
                        setJsonValue(
                          JSON.stringify(
                            {
                              teacherId: "",
                              timeExpiration: 0,
                              entityIds: [],
                              questions: [
                                {
                                  id: "",
                                  title: "",
                                  hint: "",
                                  description: "",
                                  correctTitle: 0,
                                  lessonIds: [],
                                  answers: [
                                    {
                                      title: "",
                                      isCorrect: false,
                                    },
                                  ],
                                  order: 0,
                                },
                              ],
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
                placeholder={
                  quizzesDict.jsonPlaceholder ||
                  'Enter quiz JSON, e.g., {"teacherId": "...", "timeExpiration": 0, "entityIds": [...], "questions": [...]}'
                }
                className="font-mono text-sm ltr:text-start"
                rows={12}
                dir="ltr"
              />
              <Button
                onClick={handleJsonSubmit}
                disabled={isLoading || !jsonValue.trim()}
                className="w-full"
              >
                {isLoading
                  ? t.form.submitting || "Submitting..."
                  : quizzesDict.createButton || "Create Quiz"}
              </Button>
            </div>
          ) : (
            <DynamicForm
              definition={formDefinition}
              onSubmit={handleSubmit}
              formRef={formRef}
              customFieldRenderers={{
                questionsWithAnswers: () => (
                  <div className="mb-4 flex justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsCreateQuestionDialogOpen(true)}
                      className="gap-2"
                    >
                      <Plus className="size-4" />
                      {quizzesDict.createNewQuestion || "Create New Question"}
                    </Button>
                  </div>
                ),
              }}
            />
          )}
        </div>
      </DialogContent>

      <CreateQuestionDialog
        open={isCreateQuestionDialogOpen}
        onOpenChange={setIsCreateQuestionDialogOpen}
        onSubmit={handleCreateQuestion}
        isLoading={createQuestion.isPending}
      />
    </Dialog>
  );
}
