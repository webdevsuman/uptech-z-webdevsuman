"use client";

import React, { useMemo, useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { TanstackTable } from "@/components/tables/TanstackTable";
import {
  useUsersList,
  useToggleUserStatus,
  useVerifyUser,
} from "@/api/hooks/user/hook";
import { AppIcon } from "@/components/ui/app-icon";
import {
  getUserColumns,
  TUserTableItem,
} from "../components/userColumns";

export const UsersListPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<string>("all");

  const { data, isLoading, error } = useUsersList({
    role: selectedRole !== "all" ? selectedRole : undefined,
    limit: 100,
  });

  const { mutate: toggleStatus, isPending: isTogglingStatus } =
    useToggleUserStatus();
  const { mutate: verifyUser, isPending: isVerifying } = useVerifyUser();

  const users = useMemo<TUserTableItem[]>(() => {
    const list = data?.data;
    if (!Array.isArray(list)) return [];
    return list.map((item) => ({ ...item }));
  }, [data]);

  const columns = useMemo(
    () =>
      getUserColumns({
        toggleStatus,
        verifyUser,
        isTogglingStatus,
        isVerifying,
      }),
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

      {/* TanStack Table with Role Filter and Internal Confirmation Modal */}
      <TanstackTable
        columns={columns}
        data={users}
        isLoading={isLoading}
        searchPlaceholder="Search users by name, email, or role..."
        emptyMessage="No users found."
        extraHeader={
          <div className="relative min-w-[170px] sm:min-w-[200px]">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="h-10 w-full appearance-none rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 pl-3.5 pr-9 text-sm focus:border-brand-500 focus:outline-none transition cursor-pointer shadow-sm"
            >
              <option value="all">All Roles</option>
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
              <AppIcon icon="lucide:chevron-down" className="w-4 h-4" />
            </div>
          </div>
        }
      />
    </div>
  );
};

export default UsersListPage;
