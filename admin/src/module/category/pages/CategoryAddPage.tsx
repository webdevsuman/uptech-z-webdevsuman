"use client";

import React from "react";
import { useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import { useCreateCategory } from "@/api/hooks/category/hook";
import { sToast } from "@/components/ui/alert/stoast";
import CategoryAddEditForm from "../components/CategoryAddEditForm";
import { TCategoryFormData } from "../zod/category.zod";

export const CategoryAddPage: React.FC = () => {
  const router = useRouter();
  const { mutateAsync: createCategory, isPending } = useCreateCategory();

  const handleCreate = async (formData: TCategoryFormData) => {
    try {
      await createCategory({
        name: formData.name,
        icon: formData.icon?.trim() || undefined,
      });
      sToast.success("Category created successfully");
      router.push("/category/list");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create category";
      sToast.error(errorMessage);
    }
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Add Category" />

      <div className="max-w-3xl">
        <ComponentCard
          title="Add New Category"
          desc="Create a new course category to organize and curate your educational content."
        >
          <CategoryAddEditForm
            onSubmit={handleCreate}
            isSubmitting={isPending}
            isEditMode={false}
          />
        </ComponentCard>
      </div>
    </div>
  );
};

export default CategoryAddPage;
