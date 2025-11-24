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
  type SortConfig,
  type ActionMenuItem,
} from "@/components/custom/data-table-with-pagination";
import { DeleteDialog } from "@/components/custom/delete-dialog";
import { CreateStudentDialog } from "@/components/section/dashboard/student/create-student-dialog";
import { EditStudentDialog } from "@/components/section/dashboard/student/edit-student-dialog";
import type { Student } from "@/services/student.services/student.type";
import { Eye, Edit, Trash2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
const StudentsPage = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortConfig, setSortConfig] = useState<SortConfig | undefined>();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const { data, isLoading } = useStudents({ page, PerPage: pageSize });
  const createStudent = useCreateStudent();
  const updateStudent = useUpdateStudent(selectedStudent?.id || "");
  const deleteStudent = useDeleteStudent(selectedStudent?.id || "");

  const students: Student[] = Array.isArray(data?.items)
    ? (data.items as unknown as Student[])
    : [];

  const totalCount = data?.totalCount || 0;

  const columns: Column<Student>[] = [
    {
      accessor: "firstName",
      header: "First Name",
      sortable: true,
      render: (value) => (
        <span className="font-medium">{value ? String(value) : "-"}</span>
      ),
    },
    {
      accessor: "lastName",
      header: "Last Name",
      sortable: true,
      render: (value) => (
        <span className="font-medium">{value ? String(value) : "-"}</span>
      ),
    },
    {
      accessor: "email",
      header: "Email",
      sortable: true,
      render: (value) => (
        <span className="text-muted-foreground">
          {value ? String(value) : "-"}
        </span>
      ),
    },
    {
      accessor: "phoneNumber",
      header: "Phone Number",
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

  const actionMenuItems: ActionMenuItem<Student>[] = [
    {
      label: "View",
      icon: <Eye className="h-4 w-4" />,
      onClick: (student) => {
        router.push(`/dashboard/students/${student.id}`);
      },
    },
    {
      label: "Edit",
      icon: <Edit className="h-4 w-4" />,
      onClick: (student) => {
        setSelectedStudent(student);
        setIsEditDialogOpen(true);
      },
    },
    {
      label: "Delete",
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

  const handleSortChange = (
    field: string,
    direction: "asc" | "desc" | null,
  ) => {
    setSortConfig(direction ? { field, direction } : undefined);
    setPage(1);
  };

  const handleRowClick = (student: Student) => {
    router.push(`/dashboard/students/${student.id}`);
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs
        className="mb-4"
        routeLabels={{
          dashboard: "Dashboard",
          students: "Students",
        }}
      />

      <div className="bg-sidebar border-border flex items-start justify-between rounded-lg border p-5">
        <div className="flex flex-col">
          {" "}
          <h1 className="mb-2 text-2xl font-semibold">Students</h1>
          <p className="text-muted-foreground text-sm">
            Manage and view all students in the system
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCreateDialogOpen(true)}
          className="h-9 w-9 rounded-full p-0"
          aria-label="Create new student"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <DataTableWithPagination<Student>
        data={students}
        columns={columns}
        loading={isLoading}
        totalCount={totalCount}
        currentPage={page}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        title="Students List"
        subtitle={`Manage and view all ${totalCount} students in the system`}
        emptyMessage="No students found"
        sortConfig={sortConfig}
        onSortChange={handleSortChange}
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

      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          setIsDeleteDialogOpen(open);
          if (!open) setSelectedStudent(null);
        }}
        onConfirm={handleDeleteStudent}
        title="Delete Student"
        itemName={
          selectedStudent
            ? `${selectedStudent.firstName} ${selectedStudent.lastName}`
            : undefined
        }
        description={
          selectedStudent
            ? `Are you sure you want to delete "${selectedStudent.firstName} ${selectedStudent.lastName}"? This action cannot be undone.`
            : undefined
        }
        isLoading={deleteStudent.isPending}
        confirmText="Delete"
      />
    </div>
  );
};
export default StudentsPage;
