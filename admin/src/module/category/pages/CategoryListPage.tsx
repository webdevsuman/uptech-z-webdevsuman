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
  useCategoriesList,
  useDeleteCategory,
} from "@/api/hooks/category/hook";
import { ICategoryItem } from "@/api/hooks/category/schema";
import { AppIcon } from "@/components/ui/app-icon";
import { sToast } from "@/components/ui/alert/stoast";
import { ROUTES } from "@/navigation/sidebar/routes";

export type TCategoryTableItem = ICategoryItem & Record<string, unknown>;

export const CategoryListPage: React.FC = () => {
  const { data, isLoading, error } = useCategoriesList();
  const { mutateAsync: deleteCategory } = useDeleteCategory();

  const categories = useMemo<TCategoryTableItem[]>(() => {
    const list = data?.data;
    if (!Array.isArray(list)) return [];
    return list.map((item) => ({ ...item }));
  }, [data]);

  const columns = useMemo<
    TableOptions<TAppTableFeatures, TCategoryTableItem>["columns"]
  >(
    () => [
      {
        accessorKey: "icon",
        header: () => "Icon",
        cell: ({ row }) => {
          const iconName = row.original.icon?.trim() || "lucide:folder";
          return (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
              <AppIcon icon={iconName} className="w-5 h-5" />
            </div>
          );
        },
      },
      {
        accessorKey: "name",
        header: () => "Category Name",
        cell: ({ row }) => (
          <div>
            <p className="font-semibold text-gray-800 dark:text-white/90">
              {row.original.name}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "createdAt",
        header: () => "Created Date",
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
        cell: ({ row, table }) => (
          <div className="flex items-center gap-1.5">
            <Link
              href={ROUTES.categories.edit(row.original._id)}
              className="p-1.5 text-gray-500 hover:text-brand-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              title="Edit Category"
            >
              <AppIcon icon="lucide:pencil" className="w-4 h-4" />
            </Link>
            <button
              type="button"
              onClick={() =>
                table.options.meta?.confirm({
                  title: `Delete category "${row.original.name}"?`,
                  description:
                    "This action cannot be undone. Courses associated with this category may be affected.",
                  confirmText: "Delete",
                  variant: "danger",
                  onConfirm: async () => {
                    try {
                      await deleteCategory({ id: row.original._id });
                      sToast.success("Category deleted successfully");
                    } catch (err: unknown) {
                      const message =
                        err instanceof Error
                          ? err.message
                          : "Failed to delete category";
                      sToast.error(message);
                    }
                  },
                })
              }
              className="p-1.5 text-gray-500 hover:text-error-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              title="Delete Category"
            >
              <AppIcon icon="lucide:trash-2" className="w-4 h-4" />
            </button>
          </div>
        ),
      },
    ],
    [deleteCategory]
  );

  return (
    <div>
      <PageBreadcrumb pageTitle="Categories" />

      {/* Action Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white/90">
            Category Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Organize and curate course categories for your learning platform.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
            Total Categories: {categories.length}
          </span>
          <Link
            href={ROUTES.categories.add}
            className="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-4 py-2.5 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600"
          >
            <AppIcon icon="lucide:plus" className="w-4 h-4" />
            <span>Add Category</span>
          </Link>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 mb-4 rounded-xl border border-error-200 bg-error-50 text-error-700 text-sm dark:bg-error-500/10 dark:border-error-500/20 dark:text-error-400">
          Failed to load categories: {error.message}
        </div>
      )}

      {/* TanStack Table */}
      <TanstackTable
        columns={columns}
        data={categories}
        isLoading={isLoading}
        searchPlaceholder="Search categories by name..."
        emptyMessage="No categories found. Click 'Add Category' to create one."      />
    </div>
  );
};

export default CategoryListPage;
