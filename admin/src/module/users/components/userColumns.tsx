"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { TableOptions } from "@tanstack/react-table";
import { TAppTableFeatures } from "@/components/tables/TanstackTable";
import { IUserItem } from "@/api/hooks/user/schema";
import { mediaUrl } from "@/api/endpoints";
import AvatarText from "@/components/ui/avatar/AvatarText";
import Badge from "@/components/ui/badge/Badge";
import { AppIcon } from "@/components/ui/app-icon";

export type TUserTableItem = IUserItem & Record<string, unknown>;

export interface GetUserColumnsParams {
  toggleStatus: (payload: { id: string; isActive: boolean }) => void;
  verifyUser: (payload: { id: string; isVerified: boolean }) => void;
  isTogglingStatus: boolean;
  isVerifying: boolean;
}

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

export const getUserColumns = ({
  toggleStatus,
  verifyUser,
  isTogglingStatus,
  isVerifying,
}: GetUserColumnsParams): TableOptions<TAppTableFeatures, TUserTableItem>["columns"] => [
  {
    accessorKey: "name",
    header: () => "User",
    cell: ({ row }) => {
      const profilePic = row.original.profilePicture;
      const avatarUrl = profilePic ? mediaUrl(profilePic) : null;

      return (
        <div className="flex items-center gap-3">
          {avatarUrl ? (
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <Image
                src={avatarUrl}
                alt={row.original.name || "User"}
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <AvatarText name={row.original.name || "User"} />
          )}
          <div>
            <p className="font-medium text-gray-800 dark:text-white/90">
              {row.original.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {row.original.email}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: () => "Role",
    cell: ({ row }) => {
      const roleName = row.original.role?.name || "N/A";
      return (
        <Badge variant="light" color={getRoleBadgeColor(roleName)} size="sm">
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
          <Badge variant="light" color={isActive ? "success" : "error"} size="sm">
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
];
