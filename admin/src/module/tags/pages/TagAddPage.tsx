"use client";

import React from "react";
import { useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import { useCreateTag } from "@/api/hooks/tags/hook";
import { sToast } from "@/components/ui/alert/stoast";
import { ROUTES } from "@/navigation/sidebar/routes";
import TagAddEditForm from "../components/TagAddEditForm";
import { TTagFormData } from "../zod/tag.zod";

export const TagAddPage: React.FC = () => {
  const router = useRouter();
  const { mutateAsync: createTag, isPending } = useCreateTag();

  const handleCreate = async (formData: TTagFormData) => {
    try {
      await createTag({
        name: formData.name,
      });
      sToast.success("Tag created successfully");
      router.push(ROUTES.tags.list);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create tag";
      sToast.error(errorMessage);
    }
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Add Tag" />

      <div className="max-w-2xl">
        <ComponentCard
          title="Add New Tag"
          desc="Create a new tag for categorizing and labeling course topics."
        >
          <TagAddEditForm
            onSubmit={handleCreate}
            isSubmitting={isPending}
            isEditMode={false}
          />
        </ComponentCard>
      </div>
    </div>
  );
};

export default TagAddPage;
