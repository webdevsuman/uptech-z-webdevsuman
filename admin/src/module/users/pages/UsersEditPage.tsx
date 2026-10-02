"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import {
  useUserDetails,
  useUpdateUser,
  useToggleUserStatus,
  useVerifyUser,
} from "@/api/hooks/user/hook";
import UsersAddEditForm from "../components/UsersAddEditForm";
import { TUserEditFormData } from "../zod/user.zod";
import AvatarText from "@/components/ui/avatar/AvatarText";
import Badge from "@/components/ui/badge/Badge";
import { AppIcon } from "@/components/ui/app-icon";
import ConfirmationModal, {
  TConfirmModalVariant,
} from "@/components/common/ConfirmationModal";

export interface UsersEditPageProps {
  id: string;
}

export const UsersEditPage: React.FC<UsersEditPageProps> = ({ id }) => {
  const router = useRouter();
  const { data, isLoading, error } = useUserDetails(id);
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();
  const { mutate: toggleStatus, isPending: isTogglingStatus } =
    useToggleUserStatus();
  const { mutate: verifyUser, isPending: isVerifying } = useVerifyUser();

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    confirmText: string;
    variant: TConfirmModalVariant;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    description: "",
    confirmText: "Confirm",
    variant: "primary",
    onConfirm: () => {},
  });

  const user = data?.data;

  const handleUpdate = (formData: TUserEditFormData) => {
    updateUser(
      {
        id,
        name: formData.name,
        bio: formData.bio,
        qualification: formData.qualification,
      },
      {
        onSuccess: () => {
          router.push("/users/list");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Edit User" />
        <div className="flex flex-col items-center justify-center p-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-white/[0.05]">
          <AppIcon icon="lucide:loader" className="w-8 h-8 animate-spin text-brand-500 mb-3" />
          <p className="text-sm text-gray-500">Loading user profile...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Edit User" />
        <div className="p-6 bg-error-50 border border-error-200 text-error-700 rounded-2xl dark:bg-error-500/10 dark:border-error-500/20 dark:text-error-400">
          <h3 className="font-semibold text-base mb-1">User Not Found</h3>
          <p className="text-sm">
            {error?.message || "The user you are trying to edit could not be found or access is restricted."}
          </p>
          <div className="mt-4">
            <Link
              href="/users/list"
              className="inline-flex items-center gap-1.5 text-sm font-medium underline"
            >
              <AppIcon icon="lucide:arrow-left" className="w-4 h-4" />
              <span>Return to User List</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Edit User" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <AvatarText name={user.name} className="h-14 w-14 text-base" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-gray-800 dark:text-white/90">
                {user.name}
              </h1>
              <Badge variant="light" color={user.isActive ? "success" : "error"} size="sm">
                {user.isActive ? "Active" : "Inactive"}
              </Badge>
              <Badge variant="light" color={user.isVerified ? "success" : "warning"} size="sm">
                {user.isVerified ? "Verified" : "Pending"}
              </Badge>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Member since {new Date(user.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Quick Status Toggle Buttons */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            disabled={isTogglingStatus}
            onClick={() => {
              const willDeactivate = user.isActive;
              setConfirmModal({
                isOpen: true,
                title: willDeactivate ? "deactivate this account?" : "activate this account?",
                description: willDeactivate
                  ? `Are you sure you want to deactivate ${user.name}? They will be blocked from logging into the system.`
                  : `Are you sure you want to activate ${user.name}? Their access will be restored immediately.`,
                confirmText: willDeactivate ? "Deactivate" : "Activate",
                variant: willDeactivate ? "danger" : "success",
                onConfirm: () => {
                  toggleStatus(
                    { id: user._id, isActive: !willDeactivate },
                    {
                      onSettled: () =>
                        setConfirmModal((prev) => ({ ...prev, isOpen: false })),
                    }
                  );
                },
              });
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition ${
              user.isActive
                ? "border-error-200 text-error-600 bg-error-50 hover:bg-error-100 dark:bg-error-500/10 dark:border-error-500/20"
                : "border-success-200 text-success-600 bg-success-50 hover:bg-success-100 dark:bg-success-500/10 dark:border-success-500/20"
            }`}
          >
            {user.isActive ? "Deactivate Account" : "Activate Account"}
          </button>

          <button
            type="button"
            disabled={isVerifying}
            onClick={() => {
              const willRevoke = user.isVerified;
              setConfirmModal({
                isOpen: true,
                title: willRevoke ? "revoke email verification?" : "verify this email?",
                description: willRevoke
                  ? `Are you sure you want to revoke email verification for ${user.name}?`
                  : `Are you sure you want to mark ${user.name}'s email as verified?`,
                confirmText: willRevoke ? "Unverify" : "Verify",
                variant: willRevoke ? "warning" : "primary",
                onConfirm: () => {
                  verifyUser(
                    { id: user._id, isVerified: !willRevoke },
                    {
                      onSettled: () =>
                        setConfirmModal((prev) => ({ ...prev, isOpen: false })),
                    }
                  );
                },
              });
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition ${
              user.isVerified
                ? "border-gray-200 text-gray-600 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                : "border-brand-200 text-brand-600 bg-brand-50 hover:bg-brand-100 dark:bg-brand-500/10 dark:border-brand-500/20"
            }`}
          >
            {user.isVerified ? "Mark Unverified" : "Mark Verified"}
          </button>
        </div>
      </div>

      {/* Edit Form Card */}
      <div className="max-w-3xl">
        <ComponentCard
          title="Edit Profile Information"
          desc="Update user's name, qualifications, and biography."
        >
          <UsersAddEditForm
            initialData={{
              name: user.name,
              bio: user.bio,
              qualification: user.qualification,
              role: user.role?._id,
            }}
            email={user.email}
            roleName={user.role?.name}
            onSubmit={handleUpdate}
            isSubmitting={isUpdating}
          />
        </ComponentCard>
      </div>

      {/* Modular Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        description={confirmModal.description}
        confirmText={confirmModal.confirmText}
        variant={confirmModal.variant}
        isLoading={isTogglingStatus || isVerifying}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
      />
    </div>
  );
};

export default UsersEditPage;
