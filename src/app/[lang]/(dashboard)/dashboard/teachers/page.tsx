"use client";
import {
  ActionMenuItem,
  Breadcrumbs,
  Column,
  DataTableWithPagination,
} from "@/components/custom";
import { CreateTeacherDialog } from "@/components/section/dashboard/teacher/create-teacher-dialog";
import { EditTeacherDialog } from "@/components/section/dashboard/teacher/edit-teacher-dialog";
import { PageHeader } from "@/components/section/dashboard/page-header";
import { useTranslation } from "@/providers/TranslationsProvider";
import {
  useCreateTeacher,
  useTeachers,
  useUpdateTeacher,
  useDeleteTeacher,
} from "@/services/teacher.services/teacher.query";
import {
  Teacher,
  CreateTeacherInput,
} from "@/services/teacher.services/teacher.type";
import { Edit, Eye, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatEntityName } from "@/utils/format";
import { dashboardRoutesName } from "@/utils/constant";
import { getLocalizedHref } from "@/utils/localized-href";
import { useCurrentLang } from "@/hooks/useCurrentLang";
import { ConfirmDialog } from "@/components/custom/confirm-dialog";

const TeachersPage = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const router = useRouter();
  const { data, isLoading } = useTeachers({ page, PerPage: pageSize });
  const createTeacher = useCreateTeacher();
  const updateTeacher = useUpdateTeacher(selectedTeacher?.id || "");
  const deleteTeacher = useDeleteTeacher(selectedTeacher?.id || "");
  const teachers: Teacher[] = Array.isArray(data?.items)
    ? (data.items as unknown as Teacher[])
    : [];
  const totalCount = data?.totalCount || 0;
  const t = useTranslation();
  const common = t.dashboard.common;
  const teachersDict = t.dashboard.teachers;
  const lang = useCurrentLang();
  const columns: Column<Teacher>[] = [
    {
      accessor: "firstName",
      header: common.firstName,

      render: (value) => (
        <span className="font-medium">{value ? String(value) : "-"}</span>
      ),
    },
    {
      accessor: "lastName",
      header: common.lastName,

      render: (value) => (
        <span className="font-medium">{value ? String(value) : "-"}</span>
      ),
    },
    {
      accessor: "email",
      header: common.email,

      render: (value) => (
        <span className="font-medium">{value ? String(value) : "-"}</span>
      ),
    },
    {
      accessor: "phoneNumber",
      header: common.phoneNumber,

      render: (value) => (
        <span className="font-medium">{value ? String(value) : "-"}</span>
      ),
    },
    {
      accessor: "description",
      header: common.description,

      render: (value) => (
        <span className="font-medium">{value ? String(value) : "-"}</span>
      ),
    },
    {
      accessor: "numberOfQuizzes",
      header: teachersDict.numberOfQuizzes,

      render: (value) => (
        <span className="font-medium">{value ? String(value) : "-"}</span>
      ),
    },
  ];
  const actionMenuItems: ActionMenuItem<Teacher>[] = [
    {
      label: common.view,
      icon: <Eye className="h-4 w-4" />,
      onClick: (teacher) =>
        router.push(
          getLocalizedHref(
            dashboardRoutesName.teachers.href.replace(":id", teacher.id),
            lang,
          ),
        ),
    },
    {
      label: common.edit,
      icon: <Edit className="h-4 w-4" />,
      onClick: (teacher) => {
        setSelectedTeacher(teacher);
        setIsEditDialogOpen(true);
      },
    },
    {
      label: common.delete,
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (teacher) => {
        setSelectedTeacher(teacher);
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

  const handleRowClick = (teacher: Teacher) => {
    router.push(`/dashboard/teachers/${teacher.id}`);
  };

  const handleCreateTeacher = async (data: CreateTeacherInput) => {
    await createTeacher.mutateAsync(data);
  };

  const handleUpdateTeacher = async (data: CreateTeacherInput) => {
    if (!selectedTeacher) return;
    await updateTeacher.mutateAsync(data);
    setSelectedTeacher(null);
  };

  const handleDeleteTeacher = async () => {
    if (!selectedTeacher) return;
    await deleteTeacher.mutateAsync();
    setSelectedTeacher(null);
  };

  return (
    <div className="dashboard-container">
      <Breadcrumbs className="mb-4" />
      <PageHeader
        title={teachersDict.title}
        description={formatEntityName(
          t.sidebar.teachers,
          t.dashboard.common.descriptionEntity,
        )}
        entityName={t.sidebar.teachers}
        onCreateClick={() => setIsCreateDialogOpen(true)}
        className="items-end"
      />
      <DataTableWithPagination<Teacher>
        data={teachers}
        columns={columns}
        loading={isLoading}
        totalCount={totalCount}
        currentPage={page}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        emptyMessage={teachersDict.emptyMessage}
        actionMenuItems={actionMenuItems}
        onRowClick={handleRowClick}
      />

      <CreateTeacherDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateTeacher}
        isLoading={createTeacher.isPending}
      />

      <EditTeacherDialog
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) setSelectedTeacher(null);
        }}
        teacher={selectedTeacher}
        onSubmit={handleUpdateTeacher}
        isLoading={updateTeacher.isPending}
      />

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          setIsDeleteDialogOpen(open);
          if (!open) setSelectedTeacher(null);
        }}
        onConfirm={handleDeleteTeacher}
        variant="delete"
        title={teachersDict.deleteTitle}
        description={
          selectedTeacher
            ? `${common.areYouSureDelete} "${selectedTeacher.firstName} ${selectedTeacher.lastName}"? ${common.thisActionCannotBeUndone}`
            : undefined
        }
        isLoading={deleteTeacher.isPending}
        confirmText={common.delete}
        cancelText={t.dashboard.common.cancel || "Cancel"}
      />
    </div>
  );
};

export default TeachersPage;
