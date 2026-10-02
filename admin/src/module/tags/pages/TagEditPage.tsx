"use client";

import React from "react";
import { useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import {
  useTagDetails,
  useUpdateTag,
} from "@/api/hooks/tags/hook";
import { sToast } from "@/components/ui/alert/stoast";
import { AppIcon } from "@/components/ui/app-icon";
import { ROUTES } from "@/navigation/sidebar/routes";
import TagAddEditForm from "../components/TagAddEditForm";
import { TTagFormData } from "../zod/tag.zod";

export interface TagEditPageProps {
  id: string;
}

export const TagEditPage: React.FC<TagEditPageProps> = ({ id }) => {
  const router = useRouter();
  const { data, isLoading, error } = useTagDetails(id);
  const { mutateAsync: updateTag, isPending: isUpdating } = useUpdateTag();

  const tag = data?.data;

  const handleUpdate = async (formData: TTagFormData) => {
    try {
      await updateTag({
        id,
        name: formData.name,
      });
      sToast.success("Tag updated successfully");
      router.push(ROUTES.tags.list);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update tag";
      sToast.error(errorMessage);
    }
  };

  if (isLoading) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Edit Tag" />
        <div className="flex flex-col items-center justify-center p-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-white/[0.05]">
          <AppIcon
            icon="lucide:loader"
            className="w-8 h-8 animate-spin text-brand-500 mb-3"
          />
          <p className="text-sm text-gray-500">Loading tag details...</p>
        </div>
      </div>
    );
  }

  if (error || !tag) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Edit Tag" />
        <div className="p-6 rounded-2xl border border-error-200 bg-error-50 text-error-700 dark:bg-error-500/10 dark:border-error-500/20 dark:text-error-400">
          <p className="font-medium">Failed to load tag</p>
          <p className="text-sm mt-1">
            {error?.message || "The requested tag could not be found."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Edit Tag" />

      <div className="max-w-2xl">
        <ComponentCard
          title={`Edit Tag: #${tag.name}`}
          desc="Update the tag label used across courses."
        >
          <TagAddEditForm
            initialData={{
              name: tag.name,
            }}
            onSubmit={handleUpdate}
            isSubmitting={isUpdating}
            isEditMode={true}
          />
        </ComponentCard>
      </div>
    </div>
  );
};

export default TagEditPage;
