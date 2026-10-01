"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { useGetHomeAssets } from "@/api/hooks/cms/hooks";
import HomeAssetsTable, {
  THomeAssetTableItem,
} from "../components/HomeAssetsTable";
import { AppIcon } from "@/components/ui/app-icon";

export const HomeAssetsListPage: React.FC = () => {
  const { data, isLoading, error } = useGetHomeAssets();

  const assets = useMemo<THomeAssetTableItem[]>(() => {
    const list = data?.data;
    if (!Array.isArray(list)) return [];
    return list.map((item) => ({
      ...item,
    }));
  }, [data]);

  return (
    <div>
      <PageBreadcrumb pageTitle="Homepage CMS" />

      {/* Action Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white/90">
            Homepage Assets
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage banner sections, headlines, and content blocks displayed on the learner homepage.
          </p>
        </div>

        <Link
          href="/cms/homepage/add"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 transition shadow-theme-xs self-start sm:self-auto"
        >
          <AppIcon icon="lucide:plus" className="w-4 h-4" />
          <span>Add Asset</span>
        </Link>
      </div>

      {/* Error notification banner if query failed */}
      {error && (
        <div className="p-4 mb-4 rounded-xl border border-error-200 bg-error-50 text-error-700 text-sm dark:bg-error-500/10 dark:border-error-500/20 dark:text-error-400">
          Failed to load homepage assets: {error.message}
        </div>
      )}

      {/* Table Container */}
      <HomeAssetsTable data={assets} isLoading={isLoading} />
    </div>
  );
};

export default HomeAssetsListPage;
