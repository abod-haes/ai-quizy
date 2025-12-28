"use client";
import {
  ActionMenuItem,
  Breadcrumbs,
  Column,
  DataTableWithPagination,
} from "@/components/custom";
import { CreateSubjectDialog } from "@/components/section/dashboard/subject/create-subject-dialog";
import { EditSubjectDialog } from "@/components/section/dashboard/subject/edit-subject-dialog";
import { PageHeader } from "@/components/section/dashboard/page-header";
import { useTranslation } from "@/providers/TranslationsProvider";
import {
  useCreateSubject,
  useSubjects,
  useUpdateSubject,
  useDeleteSubject,
} from "@/services/subject.services/subject.query";
import {
  Subject,
  CreateSubjectInput,
} from "@/services/subject.services/subject.type";
import { Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { formatEntityName } from "@/utils/format";
import { ConfirmDialog } from "@/components/custom/confirm-dialog";

const SubjectsPage = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const { data, isLoading } = useSubjects({ page, PerPage: pageSize });
  const createSubject = useCreateSubject();
  const updateSubject = useUpdateSubject(selectedSubject?.id || "");
  const deleteSubject = useDeleteSubject(selectedSubject?.id || "");

  const subjects: Subject[] =
    data && Array.isArray(data.items)
      ? (data.items as unknown as Subject[])
      : [];
  const totalCount = data?.totalCount ?? 0;
  const t = useTranslation();
  const common = t.dashboard.common;
  const subjectsDict = t.dashboard.subjects;

  const columns: Column<Subject>[] = [
    {
      accessor: "name",
      header: "Name",

      render: (value) => (
        <span className="font-medium">{value ? String(value) : "-"}</span>
      ),
    },
  ];

  const actionMenuItems: ActionMenuItem<Subject>[] = [
    {
      label: common.edit,
      icon: <Edit className="h-4 w-4" />,
      onClick: (subject) => {
        setSelectedSubject(subject);
        setIsEditDialogOpen(true);
      },
    },
    {
      label: common.delete,
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (subject) => {
        setSelectedSubject(subject);
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

  const handleCreateSubject = async (data: CreateSubjectInput) => {
    await createSubject.mutateAsync(data);
    setIsCreateDialogOpen(false);
  };

  const handleUpdateSubject = async (data: CreateSubjectInput) => {
    if (!selectedSubject) return;
    await updateSubject.mutateAsync(data);
    setSelectedSubject(null);
    setIsEditDialogOpen(false);
  };

  const handleDeleteSubject = async () => {
    if (!selectedSubject) return;
    await deleteSubject.mutateAsync();
    setSelectedSubject(null);
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="dashboard-container">
      <Breadcrumbs className="mb-4" />
      <PageHeader
        title={subjectsDict.title}
        description={formatEntityName(
          t.sidebar.subjects,
          t.dashboard.common.descriptionEntity,
        )}
        entityName={t.sidebar.subjects}
        onCreateClick={() => setIsCreateDialogOpen(true)}
      />
      <DataTableWithPagination<Subject>
        data={subjects}
        columns={columns}
        loading={isLoading}
        totalCount={totalCount}
        currentPage={page}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        emptyMessage={subjectsDict.emptyMessage}
        actionMenuItems={actionMenuItems}
      />

      <CreateSubjectDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateSubject}
        isLoading={createSubject.isPending}
      />

      <EditSubjectDialog
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) setSelectedSubject(null);
        }}
        subject={selectedSubject}
        onSubmit={handleUpdateSubject}
        isLoading={updateSubject.isPending}
      />

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          setIsDeleteDialogOpen(open);
          if (!open) setSelectedSubject(null);
        }}
        onConfirm={handleDeleteSubject}
        variant="delete"
        title={subjectsDict.deleteTitle}
        description={
          selectedSubject
            ? `${common.areYouSureDelete} "${selectedSubject.name}"? ${common.thisActionCannotBeUndone}`
            : undefined
        }
        isLoading={deleteSubject.isPending}
        confirmText={common.delete}
        cancelText={common.cancel}
      />
    </div>
  );
};

export default SubjectsPage;
