"use client";
import {
  ActionMenuItem,
  Breadcrumbs,
  Column,
  DataTableWithPagination,
} from "@/components/custom";
import { CreateQuizDialog } from "@/components/section/dashboard/quiz/create-quiz-dialog";
// import { EditQuizDialog } from "@/components/section/dashboard/quiz/edit-quiz-dialog";
import { PageHeader } from "@/components/section/dashboard/page-header";
import { useTranslation } from "@/providers/TranslationsProvider";
import {
  useCreateQuiz,
  useQuizzes,
  useUpdateQuiz,
  useDeleteQuiz,
} from "@/services/quizes.services/quizes.query";
import {
  Quiz,
  CreateQuizInput,
  LinkedQuiz,
} from "@/services/quizes.services/quiz.type";
import { Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { formatEntityName } from "@/utils/format";
import { ConfirmDialog } from "@/components/custom/confirm-dialog";
import { toast } from "sonner";

const QuizzesPage = () => {
  // Pagination state - tracks current page and page size for the quizzes table
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Dialog state - controls visibility of create, edit, and delete dialogs
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Selected quiz state - stores the quiz being edited or deleted
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);

  // Fetch quizzes data with pagination
  const { data, isLoading } = useQuizzes({ Page: page, PerPage: pageSize });

  // Mutation hooks for CRUD operations
  const createQuiz = useCreateQuiz(); // Creates a new quiz
  const updateQuiz = useUpdateQuiz(selectedQuiz?.id || ""); // Updates existing quiz
  const deleteQuiz = useDeleteQuiz(selectedQuiz?.id || ""); // Deletes a quiz

  const quizzes: Quiz[] =
    data && Array.isArray(data.items) ? (data.items as unknown as Quiz[]) : [];
  const totalCount = data?.totalCount ?? 0;
  const t = useTranslation();
  const common = t.dashboard.common;
  const quizzesDictDefault = {
    title: "Quizzes",
    emptyMessage: "No quizzes found",
    deleteTitle: "Delete Quiz",
    teacherLabel: "Teacher",
    teacherIdLabel: "Teacher ID",
    timeExpirationLabel: "Time Expiration (minutes)",
    questionsCountLabel: "Questions Count",
    isSolvedLabel: "Status",
    solvedPercentageLabel: "Completion",
    timeSpentLabel: "Time Spent",
    linkedQuizLabel: "Linked Quiz",
    isPurchasedLabel: "Purchased",
    createSuccess: "Quiz created successfully",
    createError: "Failed to create quiz",
    editSuccess: "Quiz updated successfully",
    editError: "Failed to update quiz",
    deleteSuccess: "Quiz deleted successfully",
    deleteError: "Failed to delete quiz",
  };
  const quizzesDict = {
    ...quizzesDictDefault,
    ...((t.dashboard as Record<string, unknown>).quizzes as
      | typeof quizzesDictDefault
      | undefined),
  };

  const columns: Column<Quiz>[] = [
    {
      accessor: "id",
      header: "ID",
      render: (value) => (
        <span className="text-muted-foreground font-mono text-xs">
          {value ? String(value) : "-"}
        </span>
      ),
    },
    {
      accessor: "teacherName",
      header: quizzesDict.teacherLabel,
      render: (value) => (
        <span className="font-medium">{value ? String(value) : "-"}</span>
      ),
    },
    {
      accessor: "teacherId",
      header: quizzesDict.teacherIdLabel,
      render: (value) => (
        <span className="text-muted-foreground font-mono text-xs">
          {value ? String(value) : "-"}
        </span>
      ),
    },
    {
      accessor: "timeExpiration",
      header: quizzesDict.timeExpirationLabel,
      render: (value) => (
        <span className="text-muted-foreground">
          {value ? `${(value as number) * 60} m` : "0 m"}
        </span>
      ),
    },
    {
      accessor: "questionsCount",
      header: quizzesDict.questionsCountLabel,
      render: (value) => (
        <span className="font-medium">{value ? String(value) : "0"}</span>
      ),
    },
    {
      accessor: "isSolved",
      header: quizzesDict.isSolvedLabel,
      render: (value) => (
        <span
          className={`font-medium ${
            value ? "text-green-600" : "text-gray-600"
          }`}
        >
          {value ? "Solved" : "Not Solved"}
        </span>
      ),
    },
    {
      accessor: "solvedPercentage",
      header: quizzesDict.solvedPercentageLabel,
      render: (value) => (
        <span className="font-medium">{value ? `${value}%` : "0%"}</span>
      ),
    },
    {
      accessor: "timeSpentFormatted",
      header: quizzesDict.timeSpentLabel,
      render: (value) => (
        <span className="text-muted-foreground">
          {value ? String(value) : "00:00:00"}
        </span>
      ),
    },
    {
      accessor: "linkedQuiz",
      header: quizzesDict.linkedQuizLabel,
      render: (value) => {
        const linkedQuizzes = Array.isArray(value)
          ? (value as LinkedQuiz[])
          : [];
        if (linkedQuizzes.length === 0) {
          return <span className="text-muted-foreground">-</span>;
        }
        return (
          <div className="flex flex-col gap-1">
            {linkedQuizzes.map((linked, index) => (
              <span
                key={linked.id || index}
                className="text-sm font-medium"
                title={`Entity ID: ${linked.entityId || "N/A"}, Type: ${linked.quizBelong || "N/A"}`}
              >
                {linked.name || linked.entityId || "-"}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      accessor: "isPurchased",
      header: quizzesDict.isPurchasedLabel,
      render: (value) => (
        <span
          className={`font-medium ${value ? "text-blue-600" : "text-gray-500"}`}
        >
          {value ? "Yes" : "No"}
        </span>
      ),
    },
  ];

  const actionMenuItems: ActionMenuItem<Quiz>[] = [
    {
      label: common.edit,
      icon: <Edit className="h-4 w-4" />,
      onClick: (quiz) => {
        setSelectedQuiz(quiz);
        setIsEditDialogOpen(true);
      },
    },
    {
      label: common.delete,
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (quiz) => {
        setSelectedQuiz(quiz);
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

  /**
   * Handles quiz creation
   * The CreateQuizDialog component supports both form and JSON modes:
   * - Form mode: User fills out a form with teacher, time expiration, lessons, and questions
   * - JSON mode: User provides the quiz data as JSON (single object or array)
   *
   * The data structure matches the API schema:
   * {
   *   teacherId: string (from teacherBrief),
   *   timeExpiration: number (in minutes),
   *   entityIds: string[] (lesson IDs from brief),
   *   questions: QuizQuestionInput[] (full question objects from question/brief)
   * }
   */
  const handleCreateQuiz = async (data: CreateQuizInput) => {
    try {
      await createQuiz.mutateAsync(data);
      toast.success(quizzesDict.createSuccess || "Quiz created successfully");
    } catch (error) {
      toast.error(quizzesDict.createError || "Failed to create quiz");
      throw error;
    }
  };

  // Used when EditQuizDialog is uncommented
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleUpdateQuiz = async (data: CreateQuizInput) => {
    if (!selectedQuiz) return;
    try {
      await updateQuiz.mutateAsync(data);
      setSelectedQuiz(null);
      toast.success(quizzesDict.editSuccess || "Quiz updated successfully");
    } catch (error) {
      toast.error(quizzesDict.editError || "Failed to update quiz");
      throw error;
    }
  };

  const handleDeleteQuiz = async () => {
    if (!selectedQuiz) return;
    try {
      await deleteQuiz.mutateAsync();
      setSelectedQuiz(null);
      toast.success(quizzesDict.deleteSuccess || "Quiz deleted successfully");
    } catch (error) {
      toast.error(quizzesDict.deleteError || "Failed to delete quiz");
      throw error;
    }
  };

  return (
    <div className="dashboard-container">
      <Breadcrumbs className="mb-4" />
      <PageHeader
        title={quizzesDict.title}
        description={formatEntityName(
          t.sidebar.quizzes || "Quizzes",
          t.dashboard.common.descriptionEntity,
        )}
        entityName={t.sidebar.quizzes || "Quizzes"}
        onCreateClick={() => setIsCreateDialogOpen(true)}
      />
      <DataTableWithPagination<Quiz>
        data={quizzes}
        columns={columns}
        loading={isLoading}
        totalCount={totalCount}
        currentPage={page}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        emptyMessage={quizzesDict.emptyMessage}
        actionMenuItems={actionMenuItems}
      />

      {/* 
        Create Quiz Dialog Component
        This dialog follows the same pattern as create-lesson-dialog.tsx:
        - Toggle between Form mode and JSON mode using the button in the header
        - Form mode: Provides a user-friendly form with dropdowns and inputs
        - JSON mode: Allows direct JSON input with toggle for single/list submission
        - The dialog automatically fetches:
          * Teachers brief (for teacherId dropdown)
          * Lessons (for entityIds multiselect)
          * Questions (for questions selection - maps to full question objects)
        - When submitting from form mode, question IDs are mapped to full question objects
        - When submitting from JSON mode, the JSON is validated and sent as-is
      */}
      <CreateQuizDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateQuiz}
        isLoading={createQuiz.isPending}
      />

      {/* Edit Quiz Dialog - commented out until implemented */}
      {/* <EditQuizDialog
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) setSelectedQuiz(null);
        }}
        quiz={selectedQuiz}
        onSubmit={handleUpdateQuiz}
        isLoading={updateQuiz.isPending}
      /> */}

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          setIsDeleteDialogOpen(open);
          if (!open) setSelectedQuiz(null);
        }}
        onConfirm={handleDeleteQuiz}
        variant="delete"
        title={quizzesDict.deleteTitle}
        description={
          selectedQuiz
            ? `${common.areYouSureDelete} "${selectedQuiz.teacherName || selectedQuiz.id}"? ${common.thisActionCannotBeUndone}`
            : undefined
        }
        isLoading={deleteQuiz.isPending}
        confirmText={common.delete}
        cancelText={t.dashboard.common.cancel || "Cancel"}
      />
    </div>
  );
};

export default QuizzesPage;
