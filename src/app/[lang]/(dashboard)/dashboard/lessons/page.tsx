"use client";
import {
  ActionMenuItem,
  Breadcrumbs,
  Column,
  DataTableWithPagination,
} from "@/components/custom";
import { CreateLessonDialog } from "@/components/section/dashboard/lesson/create-lesson-dialog";
import { EditLessonDialog } from "@/components/section/dashboard/lesson/edit-lesson-dialog";
import { PageHeader } from "@/components/section/dashboard/page-header";
import { useTranslation } from "@/providers/TranslationsProvider";
import {
  useCreateLesson,
  useCreateLessonsList,
  useLessons,
  useUpdateLesson,
  useDeleteLesson,
} from "@/services/lesson.services/lesson.query";
import {
  Lesson,
  CreateLessonInput,
} from "@/services/lesson.services/lesson.type";
import { Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { formatEntityName } from "@/utils/format";
import { ConfirmDialog } from "@/components/custom/confirm-dialog";
import { useUnits } from "@/services/unit.services/unit.query";

const LessonsPage = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const { data, isLoading } = useLessons({ page, PerPage: pageSize });
  const createLesson = useCreateLesson();
  const createLessonsList = useCreateLessonsList();
  const updateLesson = useUpdateLesson(selectedLesson?.id || "");
  const deleteLesson = useDeleteLesson(selectedLesson?.id || "");

  // Fetch all units to map unitId to unit name
  const { data: unitsData } = useUnits({ page: 1, PerPage: 1000 });

  const lessons: Lesson[] =
    data && Array.isArray(data.items)
      ? (data.items as unknown as Lesson[])
      : [];
  const totalCount = data?.totalCount ?? 0;
  const t = useTranslation();
  const common = t.dashboard.common;
  const lessonsDictDefault = {
    title: "Lessons",
    emptyMessage: "No lessons found",
    deleteTitle: "Delete Lesson",
    unit: "Unit",
  };
  const lessonsDict = {
    ...lessonsDictDefault,
    ...((t.dashboard as Record<string, unknown>).lessons as
      | typeof lessonsDictDefault
      | undefined),
  };

  // Create a map of unitId to unit name
  const unitMap = new Map<string, string>();
  if (unitsData?.items) {
    unitsData.items.forEach((unit) => {
      unitMap.set(unit.id, unit.name);
    });
  }

  const columns: Column<Lesson>[] = [
    {
      accessor: "name",
      header: "Name",

      render: (value) => (
        <span className="font-medium">{value ? String(value) : "-"}</span>
      ),
    },
    {
      accessor: "description",
      header: common.description,

      render: (value) => (
        <span className="text-muted-foreground">
          {value ? String(value) : "-"}
        </span>
      ),
    },
    {
      accessor: "unitId",
      header: lessonsDict.unit,

      render: (value, row) => {
        const unitName = unitMap.get(row.unitId) || "-";
        return <span className="font-medium">{unitName}</span>;
      },
    },
  ];

  const actionMenuItems: ActionMenuItem<Lesson>[] = [
    {
      label: common.edit,
      icon: <Edit className="h-4 w-4" />,
      onClick: (lesson) => {
        setSelectedLesson(lesson);
        setIsEditDialogOpen(true);
      },
    },
    {
      label: common.delete,
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (lesson) => {
        setSelectedLesson(lesson);
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

  const handleCreateLesson = async (data: CreateLessonInput) => {
    await createLesson.mutateAsync(data);
  };

  const handleCreateLessonsList = async (data: CreateLessonInput[]) => {
    await createLessonsList.mutateAsync(data);
  };

  const handleUpdateLesson = async (data: CreateLessonInput) => {
    if (!selectedLesson) return;
    await updateLesson.mutateAsync(data);
    setSelectedLesson(null);
  };

  const handleDeleteLesson = async () => {
    if (!selectedLesson) return;
    await deleteLesson.mutateAsync();
    setSelectedLesson(null);
  };

  return (
    <div className="dashboard-container">
      <Breadcrumbs className="mb-4" />
      <PageHeader
        title={lessonsDict.title}
        description={formatEntityName(
          t.sidebar.lessons,
          t.dashboard.common.descriptionEntity,
        )}
        entityName={t.sidebar.lessons}
        onCreateClick={() => setIsCreateDialogOpen(true)}
      />
      <DataTableWithPagination<Lesson>
        data={lessons}
        columns={columns}
        loading={isLoading}
        totalCount={totalCount}
        currentPage={page}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        emptyMessage={lessonsDict.emptyMessage}
        actionMenuItems={actionMenuItems}
      />

      <CreateLessonDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateLesson}
        onSubmitList={handleCreateLessonsList}
        isLoading={createLesson.isPending || createLessonsList.isPending}
      />

      <EditLessonDialog
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) setSelectedLesson(null);
        }}
        lesson={selectedLesson}
        onSubmit={handleUpdateLesson}
        isLoading={updateLesson.isPending}
      />

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          setIsDeleteDialogOpen(open);
          if (!open) setSelectedLesson(null);
        }}
        onConfirm={handleDeleteLesson}
        variant="delete"
        title={lessonsDict.deleteTitle}
        description={
          selectedLesson
            ? `${common.areYouSureDelete} "${selectedLesson.name}"? ${common.thisActionCannotBeUndone}`
            : undefined
        }
        isLoading={deleteLesson.isPending}
        confirmText={common.delete}
        cancelText={t.dashboard.common.cancel || "Cancel"}
      />
    </div>
  );
};

export default LessonsPage;
