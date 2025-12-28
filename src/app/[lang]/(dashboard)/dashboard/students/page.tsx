"use client";

import { useState } from "react";
import {
  useStudents,
  useCreateStudent,
  useUpdateStudent,
  useDeleteStudent,
} from "@/services/student.services/student.query";
import { Breadcrumbs } from "@/components/custom/bread-crumbs";
import {
  DataTableWithPagination,
  type Column,
  type ActionMenuItem,
} from "@/components/custom/data-table-with-pagination";
import { ConfirmDialog } from "@/components/custom/confirm-dialog";
import { CreateStudentDialog } from "@/components/section/dashboard/student/create-student-dialog";
import { EditStudentDialog } from "@/components/section/dashboard/student/edit-student-dialog";
import { PageHeader } from "@/components/section/dashboard/page-header";
import type { Student } from "@/services/student.services/student.type";
import { Eye, Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/providers/TranslationsProvider";
import { useLocalizedHref } from "@/hooks/useLocalizedHref";
import { dashboardRoutesName } from "@/utils/constant";
import { formatEntityName } from "@/utils/format";

const StudentsPage = () => {
  const t = useTranslation();
  const router = useRouter();
  const getLocalizedHref = useLocalizedHref();
  const common = t.dashboard.common;
  const studentsDict = t.dashboard.students;

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const { data, isLoading } = useStudents({ page, PerPage: pageSize });
  const createStudent = useCreateStudent();
  const updateStudent = useUpdateStudent(selectedStudent?.id || "");
  const deleteStudent = useDeleteStudent(selectedStudent?.id || "");

  const studentsList: Student[] = Array.isArray(data?.items)
    ? (data?.items as unknown as Student[])
    : [];

  const totalCount = data?.totalCount || 0;

  const columns: Column<Student>[] = [
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
        <span className="text-muted-foreground">
          {value ? String(value) : "-"}
        </span>
      ),
    },
    {
      accessor: "phoneNumber",
      header: common.phoneNumber,
      sortable: false,
      render: (value) => (
        <span className="text-muted-foreground">
          {value ? String(value) : "-"}
        </span>
      ),
    },
  ];

  const handleCreateStudent = async (data: Omit<Student, "id">) => {
    await createStudent.mutateAsync(data as Student);
  };

  const handleUpdateStudent = async (data: Student) => {
    if (!selectedStudent) return;
    await updateStudent.mutateAsync(data);
    setSelectedStudent(null);
  };

  const handleDeleteStudent = async () => {
    if (!selectedStudent) return;
    await deleteStudent.mutateAsync();
    setSelectedStudent(null);
  };

  const handleRowClick = (student: Student) => {
    router.push(
      getLocalizedHref(
        dashboardRoutesName.students.href.replace(":id", student.id),
      ),
    );
  };

  const actionMenuItems: ActionMenuItem<Student>[] = [
    {
      label: common.view,
      icon: <Eye className="h-4 w-4" />,
      onClick: handleRowClick,
    },
    {
      label: common.edit,
      icon: <Edit className="h-4 w-4" />,
      onClick: (student) => {
        setSelectedStudent(student);
        setIsEditDialogOpen(true);
      },
    },
    {
      label: common.delete,
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (student) => {
        setSelectedStudent(student);
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

  return (
    <div className="dashboard-container">
      <Breadcrumbs className="mb-4" />

      <PageHeader
        title={studentsDict.title}
        description={formatEntityName(
          t.sidebar.students,
          t.dashboard.common.descriptionEntity,
        )}
        entityName={t.sidebar.students}
        onCreateClick={() => setIsCreateDialogOpen(true)}
      />

      <DataTableWithPagination<Student>
        data={studentsList}
        columns={columns}
        loading={isLoading}
        totalCount={totalCount}
        currentPage={page}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        emptyMessage={studentsDict.emptyMessage}
        actionMenuItems={actionMenuItems}
        onRowClick={handleRowClick}
        pageSizeOptions={[10, 20, 50, 100]}
      />

      <CreateStudentDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateStudent}
        isLoading={createStudent.isPending}
      />

      <EditStudentDialog
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) setSelectedStudent(null);
        }}
        student={selectedStudent}
        onSubmit={handleUpdateStudent}
        isLoading={updateStudent.isPending}
      />

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          setIsDeleteDialogOpen(open);
          if (!open) setSelectedStudent(null);
        }}
        onConfirm={handleDeleteStudent}
        variant="delete"
        title={studentsDict.deleteTitle}
        description={
          selectedStudent
            ? `${common.areYouSureDelete} "${selectedStudent.firstName} ${selectedStudent.lastName}"? ${common.thisActionCannotBeUndone}`
            : undefined
        }
        isLoading={deleteStudent.isPending}
        confirmText={common.delete}
        cancelText={t.dashboard.common.cancel || "Cancel"}
      />
    </div>
  );
};
export default StudentsPage;
