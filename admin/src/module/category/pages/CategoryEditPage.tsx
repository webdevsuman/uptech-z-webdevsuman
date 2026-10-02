"use client";

import React from "react";
import { useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import {
  useCategoryDetails,
  useUpdateCategory,
} from "@/api/hooks/category/hook";
import { sToast } from "@/components/ui/alert/stoast";
import { AppIcon } from "@/components/ui/app-icon";
import CategoryAddEditForm from "../components/CategoryAddEditForm";
import { TCategoryFormData } from "../zod/category.zod";

export interface CategoryEditPageProps {
  id: string;
}

export const CategoryEditPage: React.FC<CategoryEditPageProps> = ({ id }) => {
  const router = useRouter();
  const { data, isLoading, error } = useCategoryDetails(id);
  const { mutateAsync: updateCategory, isPending: isUpdating } = useUpdateCategory();

  const category = data?.data;

  const handleUpdate = async (formData: TCategoryFormData) => {
    try {
      await updateCategory({
        id,
        name: formData.name,
        icon: formData.icon?.trim() || undefined,
      });
      sToast.success("Category updated successfully");
      router.push("/category/list");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update category";
      sToast.error(errorMessage);
    }
  };

  if (isLoading) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Edit Category" />
        <div className="flex flex-col items-center justify-center p-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-white/[0.05]">
          <AppIcon
            icon="lucide:loader"
            className="w-8 h-8 animate-spin text-brand-500 mb-3"
          />
          <p className="text-sm text-gray-500">Loading category details...</p>
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Edit Category" />
        <div className="p-6 rounded-2xl border border-error-200 bg-error-50 text-error-700 dark:bg-error-500/10 dark:border-error-500/20 dark:text-error-400">
          <p className="font-medium">Failed to load category</p>
          <p className="text-sm mt-1">
            {error?.message || "The requested category could not be found."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Edit Category" />

      <div className="max-w-3xl">
        <ComponentCard
          title={`Edit Category: ${category.name}`}
          desc="Update the category title and visual icon representation."
        >
          <CategoryAddEditForm
            initialData={{
              name: category.name,
              icon: category.icon || "",
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

export default CategoryEditPage;
