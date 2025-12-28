"use client";
import {
  ActionMenuItem,
  Breadcrumbs,
  Column,
  DataTableWithPagination,
} from "@/components/custom";
import { CreateQuestionDialog } from "@/components/section/dashboard/question/create-question-dialog";
import { EditQuestionDialog } from "@/components/section/dashboard/question/edit-question-dialog";
import { PageHeader } from "@/components/section/dashboard/page-header";
import { useTranslation } from "@/providers/TranslationsProvider";
import {
  useCreateQuestion,
  useQuestions,
  useUpdateQuestion,
  useDeleteQuestion,
} from "@/services/question.services/question.query";
import {
  Question,
  CreateQuestionInput,
} from "@/services/question.services/question.type";
import { Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { formatEntityName } from "@/utils/format";
import { ConfirmDialog } from "@/components/custom/confirm-dialog";
import { toast } from "sonner";

const QuestionsPage = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null,
  );
  const { data, isLoading } = useQuestions({ page, PerPage: pageSize });
  const createQuestion = useCreateQuestion();
  const updateQuestion = useUpdateQuestion(selectedQuestion?.id || "");
  const deleteQuestion = useDeleteQuestion(selectedQuestion?.id || "");

  const questions: Question[] =
    data && Array.isArray(data.items)
      ? (data.items as unknown as Question[])
      : [];
  const totalCount = data?.totalCount ?? 0;
  const t = useTranslation();
  const common = t.dashboard.common;
  const questionsDictDefault = {
    title: "Questions",
    emptyMessage: "No questions found",
    deleteTitle: "Delete Question",
    titleLabel: "Title",
    hint: "Hint",
    description: "Description",
    lessons: "Lessons",
    answers: "Answers",
    createSuccess: "Question created successfully",
    createError: "Failed to create question",
    editSuccess: "Question updated successfully",
    editError: "Failed to update question",
    deleteSuccess: "Question deleted successfully",
    deleteError: "Failed to delete question",
  };
  const questionsDict = {
    ...questionsDictDefault,
    ...((t.dashboard as Record<string, unknown>).questions as
      | typeof questionsDictDefault
      | undefined),
  };

  const columns: Column<Question>[] = [
    {
      accessor: "title",
      header: questionsDict.titleLabel,
      render: (value) => (
        <span className="font-medium">{value ? String(value) : "-"}</span>
      ),
    },
    {
      accessor: "hint",
      header: questionsDict.hint,
      render: (value) => (
        <span className="text-muted-foreground">
          {value ? String(value) : "-"}
        </span>
      ),
    },
    {
      accessor: "description",
      header: questionsDict.description,
      render: (value) => (
        <span className="text-muted-foreground">
          {value ? String(value) : "-"}
        </span>
      ),
    },
    {
      accessor: "lessonNames",
      header: questionsDict.lessons,
      render: (value) => {
        const lessons = Array.isArray(value) ? value : [];
        return (
          <span className="font-medium">
            {lessons.length > 0 ? lessons.join(", ") : "-"}
          </span>
        );
      },
    },
    {
      accessor: "answers",
      header: questionsDict.answers,
      render: (value) => {
        const answers = Array.isArray(value) ? value : [];
        const correctCount = answers.filter(
          (a: { isCorrect?: boolean }) => a.isCorrect,
        ).length;
        return (
          <span className="font-medium">
            {answers.length} ({correctCount} correct)
          </span>
        );
      },
    },
  ];

  const actionMenuItems: ActionMenuItem<Question>[] = [
    {
      label: common.edit,
      icon: <Edit className="h-4 w-4" />,
      onClick: (question) => {
        setSelectedQuestion(question);
        setIsEditDialogOpen(true);
      },
    },
    {
      label: common.delete,
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (question) => {
        setSelectedQuestion(question);
        setIsDeleteDialogOpen(true);
      },
      variant: "destructive",
      separator: true,
    },
  ];

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1);
  };

  const handleCreateQuestion = async (data: CreateQuestionInput) => {
    try {
      await createQuestion.mutateAsync(data);
      toast.success(
        questionsDict.createSuccess || "Question created successfully",
      );
    } catch (error) {
      toast.error(questionsDict.createError || "Failed to create question");
      throw error;
    }
  };

  const handleUpdateQuestion = async (data: CreateQuestionInput) => {
    if (!selectedQuestion) return;
    try {
      await updateQuestion.mutateAsync(data);
      setSelectedQuestion(null);
      toast.success(
        questionsDict.editSuccess || "Question updated successfully",
      );
    } catch (error) {
      toast.error(questionsDict.editError || "Failed to update question");
      throw error;
    }
  };

  const handleDeleteQuestion = async () => {
    if (!selectedQuestion) return;
    try {
      await deleteQuestion.mutateAsync();
      setSelectedQuestion(null);
      toast.success(
        questionsDict.deleteSuccess || "Question deleted successfully",
      );
    } catch (error) {
      toast.error(questionsDict.deleteError || "Failed to delete question");
      throw error;
    }
  };

  return (
    <div className="dashboard-container">
      <Breadcrumbs className="mb-4" />
      <PageHeader
        title={questionsDict.title}
        description={formatEntityName(
          t.sidebar.questions || "Questions",
          t.dashboard.common.descriptionEntity,
        )}
        entityName={t.sidebar.questions || "Questions"}
        onCreateClick={() => setIsCreateDialogOpen(true)}
      />
      <DataTableWithPagination<Question>
        data={questions}
        columns={columns}
        loading={isLoading}
        totalCount={totalCount}
        currentPage={page}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        emptyMessage={questionsDict.emptyMessage}
        actionMenuItems={actionMenuItems}
      />

      <CreateQuestionDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateQuestion}
        isLoading={createQuestion.isPending}
      />

      <EditQuestionDialog
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) setSelectedQuestion(null);
        }}
        question={selectedQuestion}
        onSubmit={handleUpdateQuestion}
        isLoading={updateQuestion.isPending}
      />

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          setIsDeleteDialogOpen(open);
          if (!open) setSelectedQuestion(null);
        }}
        onConfirm={handleDeleteQuestion}
        variant="delete"
        title={questionsDict.deleteTitle}
        description={
          selectedQuestion
            ? `${common.areYouSureDelete} "${selectedQuestion.title}"? ${common.thisActionCannotBeUndone}`
            : undefined
        }
        isLoading={deleteQuestion.isPending}
        confirmText={common.delete}
        cancelText={t.dashboard.common.cancel || "Cancel"}
      />
    </div>
  );
};

export default QuestionsPage;
