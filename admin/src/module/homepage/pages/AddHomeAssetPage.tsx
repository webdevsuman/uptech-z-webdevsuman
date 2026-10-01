"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import { useCreateHomeAsset } from "@/api/hooks/cms/hooks";
import HomeAssetForm from "../components/HomeAssetForm";
import { THomeAssetFormData } from "../zod/homepage.zod";
import { AppIcon } from "@/components/ui/app-icon";

export const AddHomeAssetPage: React.FC = () => {
  const router = useRouter();
  const { mutate, isPending } = useCreateHomeAsset();

  const handleCreateAsset = (formData: THomeAssetFormData) => {
    mutate(formData, {
      onSuccess: () => {
        router.push("/cms/homepage/list");
      },
    });
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Add Home Asset" />

      {/* Header with back link */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white/90">
            Create Homepage Asset
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Fill in the details below to add a new content asset to the homepage CMS.
          </p>
        </div>

        <Link
          href="/cms/homepage/list"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-400 transition"
        >
          <AppIcon icon="lucide:arrow-left" className="w-4 h-4" />
          <span>Back to Assets</span>
        </Link>
      </div>

      {/* Form Card */}
      <div className="max-w-3xl">
        <ComponentCard
          title="Asset Information"
          desc="Define the section, title headline, and descriptive body text for this component."
        >
          <HomeAssetForm
            onSubmit={handleCreateAsset}
            isSubmitting={isPending}
          />
        </ComponentCard>
      </div>
    </div>
  );
};

export default AddHomeAssetPage;
