"use client";
import { Breadcrumbs } from "@/components/custom";
import { EditStudentDialog } from "@/components/section/dashboard/student/edit-student-dialog";
import {
  useStudentById,
  useUpdateStudent,
} from "@/services/student.services/student.query";
import { useParams, useRouter } from "next/navigation";
import { useCurrentLang } from "@/hooks/useCurrentLang";
import { getDirection } from "@/utils/translations/language-utils";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Mail, Phone, User, Trash2 } from "lucide-react";
import { useState } from "react";
import type { Student } from "@/services/student.services/student.type";
import { DeleteDialog } from "@/components/custom/delete-dialog";
import { useDeleteStudent } from "@/services/student.services/student.query";
import { useTranslation } from "@/providers/TranslationsProvider";
import { formatEntityName } from "@/utils/format";

const StudentDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const lang = useCurrentLang();
  const direction = getDirection(lang);
  const isRTL = direction === "rtl";
  const t = useTranslation();
  const common = t.dashboard?.common;
  const studentsDict = t.dashboard?.students;
  const { data: student, isLoading, isError } = useStudentById(id as string);
  const updateStudent = useUpdateStudent(id as string);
  const deleteStudent = useDeleteStudent(id as string);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleUpdateStudent = async (data: Student) => {
    await updateStudent.mutateAsync(data);
  };

  const handleDeleteStudent = async () => {
    await deleteStudent.mutateAsync();
    router.push("/dashboard/students");
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Breadcrumbs className="mb-4" />
        <div className="bg-sidebar border-border rounded-lg border p-5">
          <h1 className="mb-2 text-2xl font-semibold">{studentsDict?.title}</h1>
          <p className="text-muted-foreground text-sm">
            {formatEntityName(
              t.sidebar?.students || "Students",
              common?.descriptionEntity,
            )}
          </p>
        </div>
        <div className="bg-sidebar border-border rounded-lg border p-5">
          <div className="flex items-center justify-center py-12">
            <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
            <span
              className={cn(
                "text-muted-foreground",
                isRTL ? "rtl:mr-2 rtl:ml-0" : "ml-2",
              )}
            >
              Loading...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !student) {
    return (
      <div className="space-y-6">
        <Breadcrumbs className="mb-4" />
        <div className="bg-sidebar border-border rounded-lg border p-5">
          <h1 className="mb-2 text-2xl font-semibold">Student Details</h1>
          <p className="text-muted-foreground text-sm">
            View and manage the details of a specific student
          </p>
        </div>
        <div className="bg-sidebar border-border rounded-lg border p-5">
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">
              {studentsDict?.emptyMessage || "Student not found"}
            </p>
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard/students")}
              className={cn("flex items-center gap-2")}
            >
              <ArrowLeft className="h-4 w-4" />
              {t.sidebar.students}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const studentName = `${student.firstName} ${student.lastName}`;

  return (
    <div className="space-y-6">
      <Breadcrumbs className="mb-4" />

      <div className="bg-sidebar border-border rounded-lg border p-5">
        <div className={cn("flex items-start justify-between")}>
          <div>
            <h1 className="mb-2 text-2xl font-semibold">
              {studentsDict?.title}
            </h1>
            <p className="text-muted-foreground text-sm">
              {formatEntityName(
                t.sidebar?.students || "Students",
                common?.descriptionEntity,
              )}
            </p>
          </div>
          <div className={cn("flex items-center gap-1")}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditDialogOpen(true)}
              className="h-9 w-9 rounded-full p-0"
              aria-label="Edit student"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="text-destructive hover:text-destructive hover:bg-destructive/10 h-9 w-9 rounded-full p-0"
              aria-label="Delete student"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-sidebar border-border rounded-lg border p-5">
        <div className="space-y-6">
          <div className={cn("flex items-center gap-4 border-b pb-4")}>
            <div className="bg-primary/10 flex h-16 w-16 items-center justify-center rounded-full">
              <User className="text-primary h-8 w-8" />
            </div>
            <div className={cn(isRTL && "rtl:text-start")}>
              <h2 className="text-xl font-semibold">{studentName}</h2>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className={cn("space-y-1", isRTL && "rtl:text-start")}>
              <label className="text-muted-foreground text-sm font-medium">
                {common?.firstName || "First Name"}
              </label>
              <div className={cn("flex items-center gap-2")}>
                <User className="text-muted-foreground h-4 w-4" />
                <p className="text-foreground text-base font-medium">
                  {student.firstName || "-"}
                </p>
              </div>
            </div>

            <div className={cn("space-y-1", isRTL && "rtl:text-start")}>
              <label className="text-muted-foreground text-sm font-medium">
                {common?.lastName || "Last Name"}
              </label>
              <div className={cn("flex items-center gap-2")}>
                <User className="text-muted-foreground h-4 w-4" />
                <p className="text-foreground text-base font-medium">
                  {student.lastName || "-"}
                </p>
              </div>
            </div>

            <div className={cn("space-y-1", isRTL && "rtl:text-start")}>
              <label className="text-muted-foreground text-sm font-medium">
                {common?.email || "Email"}
              </label>
              <div className={cn("flex items-center gap-2")}>
                <Mail className="text-muted-foreground h-4 w-4" />
                <a
                  href={`mailto:${student.email}`}
                  className="text-primary text-base hover:underline"
                >
                  {student.email || "-"}
                </a>
              </div>
            </div>

            <div className={cn("space-y-1", isRTL && "rtl:text-start")}>
              <label className="text-muted-foreground text-sm font-medium">
                {common?.phoneNumber || "Phone Number"}
              </label>
              <div className={cn("flex items-center gap-2")}>
                <Phone className="text-muted-foreground h-4 w-4" />
                <a
                  href={`tel:${student.phoneNumber}`}
                  className="text-primary text-base hover:underline"
                >
                  {student.phoneNumber || "-"}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EditStudentDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        student={student || null}
        onSubmit={handleUpdateStudent}
        isLoading={updateStudent.isPending}
      />

      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteStudent}
        title={studentsDict?.deleteTitle || "Delete Student"}
        itemName={studentName}
        description={`${common?.areYouSureDelete || "Are you sure you want to delete"} "${studentName}"? ${common?.thisActionCannotBeUndone || "This action cannot be undone."}`}
        isLoading={deleteStudent.isPending}
        confirmText={common?.delete || "Delete"}
      />
    </div>
  );
};

export default StudentDetailsPage;
