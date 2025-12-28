"use client";
import { useCurrentLang } from "@/hooks/useCurrentLang";
import { getDirection } from "@/utils/translations/language-utils";
import { useParams, useRouter } from "next/navigation";
import {
  useDeleteTeacher,
  useTeacherById,
  useUpdateTeacher,
} from "@/services/teacher.services/teacher.query";
import { Breadcrumbs, DeleteDialog } from "@/components/custom";
import { EditTeacherDialog } from "@/components/section/dashboard/teacher/edit-teacher-dialog";
import type { CreateTeacherInput } from "@/services/teacher.services/teacher.type";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Edit,
  NotebookPen,
  Phone,
  ReceiptIndianRupee,
  Trash2,
  User,
  Hash,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "@/providers/TranslationsProvider";
import { formatEntityName } from "@/utils/format";

const TeacherDetails = () => {
  const { id } = useParams();
  const router = useRouter();
  const lang = useCurrentLang();
  const direction = getDirection(lang);
  const isRTL = direction === "rtl";
  const t = useTranslation();
  const common = t.dashboard.common;
  const teachersDict = t.dashboard.teachers;
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { data: teacher, isLoading, isError } = useTeacherById(id as string);
  const deleteTeacher = useDeleteTeacher(id as string);
  const updateTeacher = useUpdateTeacher(id as string);

  const handleDeleteTeacher = async () => {
    await deleteTeacher.mutateAsync();
    router.push("/dashboard/teachers");
  };

  const handleUpdateTeacher = async (data: CreateTeacherInput) => {
    await updateTeacher.mutateAsync(data);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Breadcrumbs className="mb-4" />
        <div className="bg-sidebar border-border rounded-lg border p-5">
          <h1 className="mb-2 text-2xl font-semibold">{teachersDict.title}</h1>
          <p className="text-muted-foreground text-sm">
            {formatEntityName(t.sidebar.teachers, common.descriptionEntity)}
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

  if (isError || !teacher) {
    return (
      <div className="space-y-6">
        <Breadcrumbs className="mb-4" />
        <div className="bg-sidebar border-border rounded-lg border p-5">
          <h1 className="mb-2 text-2xl font-semibold">{teachersDict.title}</h1>
          <p className="text-muted-foreground text-sm">
            {formatEntityName(t.sidebar.teachers, common.descriptionEntity)}
          </p>
        </div>
        <div className="bg-sidebar border-border rounded-lg border p-5">
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">
              {teachersDict.emptyMessage}
            </p>
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard/teachers")}
              className={cn("flex items-center gap-2")}
            >
              <ArrowLeft className="h-4 w-4" />
              {t.sidebar.teachers}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const teacherName = `${teacher.firstName} ${teacher.lastName}`;

  return (
    <div className="space-y-6">
      <Breadcrumbs className="mb-4" />
      <div className="bg-sidebar border-border rounded-lg border p-5">
        <div className={cn("flex items-start justify-between")}>
          <div>
            <h1 className="mb-2 text-2xl font-semibold">
              {teachersDict.title}
            </h1>
            <p className="text-muted-foreground text-sm">
              {formatEntityName(t.sidebar.teachers, common.descriptionEntity)}
            </p>
          </div>
          <div className={cn("flex items-center gap-1")}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditDialogOpen(true)}
              className="h-9 w-9 rounded-full p-0"
              aria-label="Edit teacher"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="text-destructive hover:text-destructive hover:bg-destructive/10 h-9 w-9 rounded-full p-0"
              aria-label="Delete teacher"
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
              <h2 className="text-xl font-semibold">{teacherName}</h2>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className={cn("space-y-1", isRTL && "rtl:text-start")}>
              <label className="text-muted-foreground text-sm font-medium">
                {formatEntityName(t.sidebar.teachers, common.idLabel)}
              </label>
              <div className={cn("flex items-center gap-2")}>
                <Hash className="text-muted-foreground h-4 w-4" />
                <p className="text-foreground text-base font-medium">
                  {teacher.id || "-"}
                </p>
              </div>
            </div>

            <div className={cn("space-y-1", isRTL && "rtl:text-start")}>
              <label className="text-muted-foreground text-sm font-medium">
                {common.firstName}
              </label>
              <div className={cn("flex items-center gap-2")}>
                <User className="text-muted-foreground h-4 w-4" />
                <p className="text-foreground text-base font-medium">
                  {teacher.firstName || "-"}
                </p>
              </div>
            </div>

            <div className={cn("space-y-1", isRTL && "rtl:text-start")}>
              <label className="text-muted-foreground text-sm font-medium">
                {common.lastName}
              </label>
              <div className={cn("flex items-center gap-2")}>
                <User className="text-muted-foreground h-4 w-4" />
                <p className="text-foreground text-base font-medium">
                  {teacher.lastName || "-"}
                </p>
              </div>
            </div>

            <div className={cn("space-y-1", isRTL && "rtl:text-start")}>
              <label className="text-muted-foreground text-sm font-medium">
                {common.description}
              </label>
              <div className={cn("flex items-center gap-2")}>
                <ReceiptIndianRupee className="text-muted-foreground h-4 w-4" />
                <p className="text-foreground text-base font-medium">
                  {teacher.description || "-"}
                </p>
              </div>
            </div>
            <div className={cn("space-y-1", isRTL && "rtl:text-start")}>
              <label className="text-muted-foreground text-sm font-medium">
                {teachersDict.numberOfQuizzes}
              </label>
              <div className={cn("flex items-center gap-2")}>
                <NotebookPen className="text-muted-foreground h-4 w-4" />
                <p className="text-foreground text-base font-medium">
                  {teacher.numberOfQuizzes || "-"}
                </p>
              </div>
            </div>

            <div className={cn("space-y-1", isRTL && "rtl:text-start")}>
              <label className="text-muted-foreground text-sm font-medium">
                {common.phoneNumber}
              </label>
              <div className={cn("flex items-center gap-2")}>
                <Phone className="text-muted-foreground h-4 w-4" />
                <a
                  href={`tel:${teacher.phoneNumber}`}
                  className="text-primary text-base hover:underline"
                >
                  {teacher.phoneNumber || "-"}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EditTeacherDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        teacher={teacher || null}
        onSubmit={handleUpdateTeacher}
        isLoading={updateTeacher.isPending}
      />

      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteTeacher}
        title={teachersDict.deleteTitle}
        itemName={teacherName}
        description={`${common.areYouSureDelete} "${teacherName}"? ${common.thisActionCannotBeUndone}`}
        isLoading={deleteTeacher.isPending}
        confirmText={common.delete}
      />
    </div>
  );
};

export default TeacherDetails;
