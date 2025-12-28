"use client";
import {
  ActionMenuItem,
  Breadcrumbs,
  Column,
  DataTableWithPagination,
} from "@/components/custom";
import { CreateUnitDialog } from "@/components/section/dashboard/unit/create-unit-dialog";
import { EditUnitDialog } from "@/components/section/dashboard/unit/edit-unit-dialog";
import { PageHeader } from "@/components/section/dashboard/page-header";
import { useTranslation } from "@/providers/TranslationsProvider";
import {
  useCreateUnit,
  useUnits,
  useUpdateUnit,
  useDeleteUnit,
} from "@/services/unit.services/unit.query";
import { Unit, CreateUnitInput } from "@/services/unit.services/unit.type";
import { Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { formatEntityName } from "@/utils/format";
import { ConfirmDialog } from "@/components/custom/confirm-dialog";
import { useSubjectsBrief } from "@/services/subject.services/subject.query";

const UnitsPage = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const { data, isLoading } = useUnits({ page, PerPage: pageSize });
  const createUnit = useCreateUnit();
  const updateUnit = useUpdateUnit(selectedUnit?.id || "");
  const deleteUnit = useDeleteUnit(selectedUnit?.id || "");
  const { data: subjectsData } = useSubjectsBrief();

  const units: Unit[] =
    data && Array.isArray(data.items) ? (data.items as unknown as Unit[]) : [];
  const totalCount = data?.totalCount ?? 0;
  const t = useTranslation();
  const common = t.dashboard.common;
  const unitsDict = t.dashboard.units;

  // Create a map of subjectId to subject name
  const subjectMap = new Map<string, string>();
  if (subjectsData) {
    subjectsData.forEach((subject) => {
      subjectMap.set(subject.id, subject.name);
    });
  }

  const columns: Column<Unit>[] = [
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
      accessor: "subjectId",
      header: unitsDict.subject,

      render: (value, row) => {
        const subjectName = subjectMap.get(row.subjectId) || "-";
        return <span className="font-medium">{subjectName}</span>;
      },
    },
  ];

  const actionMenuItems: ActionMenuItem<Unit>[] = [
    {
      label: common.edit,
      icon: <Edit className="h-4 w-4" />,
      onClick: (unit) => {
        setSelectedUnit(unit);
        setIsEditDialogOpen(true);
      },
    },
    {
      label: common.delete,
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (unit) => {
        setSelectedUnit(unit);
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

  const handleCreateUnit = async (data: CreateUnitInput) => {
    await createUnit.mutateAsync(data);
  };

  const handleUpdateUnit = async (data: CreateUnitInput) => {
    if (!selectedUnit) return;
    await updateUnit.mutateAsync(data);
    setSelectedUnit(null);
  };

  const handleDeleteUnit = async () => {
    if (!selectedUnit) return;
    await deleteUnit.mutateAsync();
    setSelectedUnit(null);
  };

  return (
    <div className="dashboard-container">
      <Breadcrumbs className="mb-4" />
      <PageHeader
        title={unitsDict.title}
        description={formatEntityName(
          t.sidebar.units,
          t.dashboard.common.descriptionEntity,
        )}
        entityName={t.sidebar.units}
        onCreateClick={() => setIsCreateDialogOpen(true)}
      />
      <DataTableWithPagination<Unit>
        data={units}
        columns={columns}
        loading={isLoading}
        totalCount={totalCount}
        currentPage={page}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        emptyMessage={unitsDict.emptyMessage}
        actionMenuItems={actionMenuItems}
      />

      <CreateUnitDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateUnit}
        isLoading={createUnit.isPending}
      />

      <EditUnitDialog
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) setSelectedUnit(null);
        }}
        unit={selectedUnit}
        onSubmit={handleUpdateUnit}
        isLoading={updateUnit.isPending}
      />

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          setIsDeleteDialogOpen(open);
          if (!open) setSelectedUnit(null);
        }}
        onConfirm={handleDeleteUnit}
        variant="delete"
        title={unitsDict.deleteTitle}
        description={
          selectedUnit
            ? `${common.areYouSureDelete} "${selectedUnit.name}"? ${common.thisActionCannotBeUndone}`
            : undefined
        }
        isLoading={deleteUnit.isPending}
        confirmText={common.delete}
        cancelText={t.dashboard.common.cancel || "Cancel"}
      />
    </div>
  );
};

export default UnitsPage;
