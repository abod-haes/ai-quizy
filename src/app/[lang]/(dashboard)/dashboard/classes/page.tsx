"use client";
import {
  ActionMenuItem,
  Breadcrumbs,
  Column,
  DataTableWithPagination,
} from "@/components/custom";
import { CreateClassDialog } from "@/components/section/dashboard/class/create-class-dialog";
import { PageHeader } from "@/components/section/dashboard/page-header";
import { useTranslation } from "@/providers/TranslationsProvider";
import {
  useCreateClass,
  useClasses,
} from "@/services/classes.services/classes.query";
import {
  Class,
  CreateClassInput,
  ClassSubject,
} from "@/services/classes.services/classes.type";
import { useState } from "react";
import { formatEntityName } from "@/utils/format";

const ClassesPage = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { data, isLoading } = useClasses({ page, PerPage: pageSize });
  const createClass = useCreateClass();

  const classes: Class[] =
    data && Array.isArray(data.items) ? (data.items as unknown as Class[]) : [];
  const totalCount = data?.totalCount ?? 0;
  const t = useTranslation();
  const common = t.dashboard.common;
  const classesDict = t.dashboard.classes;

  const columns: Column<Class>[] = [
    {
      accessor: "name",
      header: "Name",

      render: (value) => (
        <span className="font-medium">{value ? String(value) : "-"}</span>
      ),
    },
    {
      accessor: "subjects",
      header: classesDict.subjects || "Subjects",
      sortable: false,
      render: (value) => {
        const subjects = value as ClassSubject[] | undefined;
        if (!subjects || subjects.length === 0) {
          return <span className="text-muted-foreground">-</span>;
        }
        return (
          <div className="flex flex-wrap gap-1">
            {subjects.map((subject, index) => (
              <span
                key={subject.id}
                className="bg-muted inline-flex items-center rounded-md px-2 py-1 text-xs font-medium"
              >
                {subject.name}
                {index < subjects.length - 1 && ","}
              </span>
            ))}
          </div>
        );
      },
    },
  ];

  const actionMenuItems: ActionMenuItem<Class>[] = [];

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1);
  };

  const handleCreateClass = async (data: CreateClassInput) => {
    await createClass.mutateAsync(data);
    setIsCreateDialogOpen(false);
  };

  return (
    <div className="dashboard-container">
      <Breadcrumbs className="mb-4" />
      <PageHeader
        title={classesDict.title}
        description={formatEntityName(
          t.sidebar.classes,
          t.dashboard.common.descriptionEntity,
        )}
        entityName={t.sidebar.classes}
        onCreateClick={() => setIsCreateDialogOpen(true)}
      />
      <DataTableWithPagination<Class>
        data={classes}
        columns={columns}
        loading={isLoading}
        totalCount={totalCount}
        currentPage={page}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        emptyMessage={classesDict.emptyMessage}
        actionMenuItems={actionMenuItems}
      />

      <CreateClassDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateClass}
        isLoading={createClass.isPending}
      />
    </div>
  );
};

export default ClassesPage;
