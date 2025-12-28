"use client";

import { useState } from "react";
import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  useUserById,
} from "@/services/user.services/user.query";
import { Breadcrumbs } from "@/components/custom/bread-crumbs";
import {
  DataTableWithPagination,
  type Column,
  type ActionMenuItem,
} from "@/components/custom/data-table-with-pagination";
import { ConfirmDialog } from "@/components/custom/confirm-dialog";
import { CreateAdminDialog } from "@/components/section/dashboard/admin/create-admin-dialog";
import { EditAdminDialog } from "@/components/section/dashboard/admin/edit-admin-dialog";
import { PageHeader } from "@/components/section/dashboard/page-header";
import type { User, UserInput } from "@/services/user.services/user.type";
import { Edit, Trash2 } from "lucide-react";
import { useTranslation } from "@/providers/TranslationsProvider";
import { formatEntityName } from "@/utils/format";
import { roleType } from "@/utils/enum/common.enum";

const AdministrationPage = () => {
  const t = useTranslation();
  const common = t.dashboard.common;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const admin = (t.dashboard as any)?.administration || {};

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<User | null>(null);

  // Always filter by Role = 3 (ADMIN)
  const { data, isLoading } = useUsers({
    page,
    PerPage: pageSize,
    Role: roleType.ADMIN,
  });
  const createAdmin = useCreateUser();
  const updateAdmin = useUpdateUser(selectedAdmin?.id || "");
  const deleteAdmin = useDeleteUser();

  // Fetch full admin data when editing
  const { data: adminData } = useUserById(selectedAdmin?.id || "", {
    enabled: !!selectedAdmin?.id && isEditDialogOpen,
  });

  const adminsList: User[] = Array.isArray(data?.items)
    ? (data?.items as unknown as User[])
    : [];

  const totalCount = data?.totalCount || 0;

  const columns: Column<User>[] = [
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
      render: (value, row) => (
        <span className="text-muted-foreground">
          {row.countryCallingCode && row.phoneNumber
            ? `${row.countryCallingCode} ${row.phoneNumber}`
            : value
              ? String(value)
              : "-"}
        </span>
      ),
    },
  ];

  const handleCreateAdmin = async (data: UserInput) => {
    await createAdmin.mutateAsync(data);
    // invalidateQueries in mutation will trigger refetch automatically
    setIsCreateDialogOpen(false);
  };

  const handleUpdateAdmin = async (data: UserInput) => {
    if (!selectedAdmin) return;
    await updateAdmin.mutateAsync(data);
    // invalidateQueries in mutation will trigger refetch automatically
    setSelectedAdmin(null);
    setIsEditDialogOpen(false);
  };

  const handleDeleteAdmin = async () => {
    if (!selectedAdmin) return;
    await deleteAdmin.mutateAsync(selectedAdmin.id);
    // invalidateQueries in mutation will trigger refetch automatically
    setSelectedAdmin(null);
    setIsDeleteDialogOpen(false);
  };

  const actionMenuItems: ActionMenuItem<User>[] = [
    {
      label: common.edit,
      icon: <Edit className="h-4 w-4" />,
      onClick: (admin) => {
        setSelectedAdmin(admin);
        setIsEditDialogOpen(true);
      },
    },
    {
      label: common.delete,
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (admin) => {
        setSelectedAdmin(admin);
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
        title={admin.title || "Administration"}
        description={formatEntityName(
          admin.title || "Administrators",
          t.dashboard.common.descriptionEntity,
        )}
        entityName={admin.title || "Administrators"}
        onCreateClick={() => setIsCreateDialogOpen(true)}
      />

      <DataTableWithPagination<User>
        data={adminsList}
        columns={columns}
        loading={isLoading}
        totalCount={totalCount}
        currentPage={page}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        emptyMessage={admin.emptyMessage || "No administrators found"}
        actionMenuItems={actionMenuItems}
        pageSizeOptions={[10, 20, 50, 100]}
      />

      <CreateAdminDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateAdmin}
        isLoading={createAdmin.isPending}
      />

      <EditAdminDialog
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) setSelectedAdmin(null);
        }}
        admin={adminData || selectedAdmin}
        onSubmit={handleUpdateAdmin}
        isLoading={updateAdmin.isPending}
      />

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          setIsDeleteDialogOpen(open);
          if (!open) setSelectedAdmin(null);
        }}
        onConfirm={handleDeleteAdmin}
        variant="delete"
        title={admin.deleteTitle || "Delete Administrator"}
        description={
          selectedAdmin
            ? `${common.areYouSureDelete} "${selectedAdmin.firstName} ${selectedAdmin.lastName}"? ${common.thisActionCannotBeUndone}`
            : undefined
        }
        isLoading={deleteAdmin.isPending}
        confirmText={common.delete}
        cancelText={common.cancel || "Cancel"}
      />
    </div>
  );
};

export default AdministrationPage;
