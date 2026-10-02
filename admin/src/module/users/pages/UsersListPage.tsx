"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { TableOptions } from "@tanstack/react-table";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import {
  TanstackTable,
  TAppTableFeatures,
} from "@/components/tables/TanstackTable";
import {
  useUsersList,
  useToggleUserStatus,
  useVerifyUser,
} from "@/api/hooks/user/hook";
import { IUserItem } from "@/api/hooks/user/schema";
import AvatarText from "@/components/ui/avatar/AvatarText";
import Badge from "@/components/ui/badge/Badge";
import { AppIcon } from "@/components/ui/app-icon";

export type TUserTableItem = IUserItem & Record<string, unknown>;

export const UsersListPage: React.FC = () => {
  const { data, isLoading, error } = useUsersList();
  const { mutate: toggleStatus, isPending: isTogglingStatus } =
    useToggleUserStatus();
  const { mutate: verifyUser, isPending: isVerifying } = useVerifyUser();

  const users = useMemo<TUserTableItem[]>(() => {
    const list = data?.data;
    if (!Array.isArray(list)) return [];
    return list.map((item) => ({
      ...item,
    }));
  }, [data]);

  const getRoleBadgeColor = (roleName?: string) => {
    switch (roleName?.toLowerCase()) {
      case "admin":
        return "error";
      case "instructor":
        return "primary";
      case "student":
        return "info";
      default:
        return "light";
    }
  };

  const columns = useMemo<
    TableOptions<TAppTableFeatures, TUserTableItem>["columns"]
  >(
    () => [
      {
        accessorKey: "name",
        header: () => "User",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <AvatarText name={row.original.name || "User"} />
            <div>
              <p className="font-medium text-gray-800 dark:text-white/90">
                {row.original.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {row.original.email}
              </p>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "role",
        header: () => "Role",
        cell: ({ row }) => {
          const roleName = row.original.role?.name || "N/A";
          return (
            <Badge
              variant="light"
              color={getRoleBadgeColor(roleName)}
              size="sm"
            >
              {roleName.toUpperCase()}
            </Badge>
          );
        },
      },
      {
        accessorKey: "isActive",
        header: () => "Status",
        cell: ({ row, table }) => {
          const isActive = row.original.isActive;
          return (
            <button
              type="button"
              disabled={isTogglingStatus}
              onClick={() =>
                table.options.meta?.confirm({
                  title: isActive ? "deactivate this user?" : "activate this user?",
                  confirmText: isActive ? "Deactivate" : "Activate",
                  variant: isActive ? "danger" : "success",
                  onConfirm: () =>
                    toggleStatus({ id: row.original._id, isActive: !isActive }),
                })
              }
              title={`Click to ${isActive ? "deactivate" : "activate"}`}
              className="inline-flex cursor-pointer transition hover:opacity-80 disabled:opacity-50"
            >
              <Badge
                variant="light"
                color={isActive ? "success" : "error"}
                size="sm"
              >
                {isActive ? "Active" : "Inactive"}
              </Badge>
            </button>
          );
        },
      },
      {
        accessorKey: "isVerified",
        header: () => "Verification",
        cell: ({ row, table }) => {
          const isVerified = row.original.isVerified;
          return (
            <button
              type="button"
              disabled={isVerifying}
              onClick={() =>
                table.options.meta?.confirm({
                  title: isVerified ? "unverify this email?" : "verify this email?",
                  confirmText: isVerified ? "Unverify" : "Verify",
                  variant: isVerified ? "warning" : "primary",
                  onConfirm: () =>
                    verifyUser({ id: row.original._id, isVerified: !isVerified }),
                })
              }
              title={`Click to ${isVerified ? "unverify" : "verify"}`}
              className="inline-flex cursor-pointer transition hover:opacity-80 disabled:opacity-50"
            >
              <Badge
                variant="light"
                color={isVerified ? "success" : "warning"}
                size="sm"
              >
                {isVerified ? "Verified" : "Pending"}
              </Badge>
            </button>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: () => "Joined Date",
        cell: ({ row }) => (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {row.original.createdAt
              ? new Date(row.original.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "N/A"}
          </span>
        ),
      },
      {
        id: "actions",
        header: () => "Actions",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Link
              href={`/users/edit/${row.original._id}`}
              className="p-1.5 text-gray-500 hover:text-brand-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              title="View & Edit Details"
            >
              <AppIcon icon="lucide:pencil" className="w-4 h-4" />
            </Link>
          </div>
        ),
      },
    ],
    [toggleStatus, verifyUser, isTogglingStatus, isVerifying]
  );

  return (
    <div>
      <PageBreadcrumb pageTitle="Users" />

      {/* Action Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white/90">
            Users Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage system users, roles, active statuses, and verification.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
            Total Users: {users.length}
          </span>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 mb-4 rounded-xl border border-error-200 bg-error-50 text-error-700 text-sm dark:bg-error-500/10 dark:border-error-500/20 dark:text-error-400">
          Failed to load users: {error.message}
        </div>
      )}

      {/* TanStack Table with Internal Confirmation Modal */}
      <TanstackTable
        columns={columns}
        data={users}
        isLoading={isLoading}
        searchPlaceholder="Search users by name, email, or role..."
        emptyMessage="No users found."
      />
    </div>
  );
};

export default UsersListPage;
