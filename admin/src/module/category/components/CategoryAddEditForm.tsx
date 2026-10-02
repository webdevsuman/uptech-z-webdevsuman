"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { AppIcon } from "@/components/ui/app-icon";
import {
  categoryZodSchema,
  TCategoryFormData,
} from "../zod/category.zod";

export interface CategoryAddEditFormProps {
  initialData?: Partial<TCategoryFormData>;
  onSubmit: (data: TCategoryFormData) => Promise<void> | void;
  isSubmitting?: boolean;
  isEditMode?: boolean;
}

const SUGGESTED_ICONS = [
  "lucide:code",
  "lucide:palette",
  "lucide:briefcase",
  "lucide:line-chart",
  "lucide:database",
  "lucide:cpu",
  "lucide:music",
  "lucide:camera",
];

export const CategoryAddEditForm: React.FC<CategoryAddEditFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting = false,
  isEditMode = false,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors, isDirty },
  } = useForm<TCategoryFormData>({
    resolver: zodResolver(categoryZodSchema),
    defaultValues: {
      name: initialData?.name || "",
      icon: initialData?.icon || "",
    },
  });

  const currentIcon = useWatch({ control, name: "icon" });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || "",
        icon: initialData.icon || "",
      });
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Category Name */}
      <div>
        <Label htmlFor="category-name">
          Category Name <span className="text-error-500">*</span>
        </Label>
        <Input
          id="category-name"
          type="text"
          placeholder="e.g. Web Development, Graphic Design, Business"
          {...register("name")}
          error={Boolean(errors.name)}
          disabled={isSubmitting}
        />
        {errors.name && (
          <p className="mt-1 text-xs text-error-500">{errors.name.message}</p>
        )}
      </div>

      {/* Icon Identifier */}
      <div>
        <Label htmlFor="category-icon">Icon Identifier (Optional)</Label>
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Input
              id="category-icon"
              type="text"
              placeholder="e.g. lucide:code or lucide:palette"
              {...register("icon")}
              error={Boolean(errors.icon)}
              disabled={isSubmitting}
            />
          </div>

          {/* Live Icon Preview Tile */}
          <div
            title="Live Icon Preview"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-800/60"
          >
            <AppIcon
              icon={currentIcon?.trim() || "lucide:folder"}
              className="w-5 h-5 text-gray-700 dark:text-gray-200"
            />
          </div>
        </div>
        {errors.icon && (
          <p className="mt-1 text-xs text-error-500">{errors.icon.message}</p>
        )}

        {/* Quick Suggestion Badges */}
        <div className="mt-2.5">
          <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400 block mb-1.5">
            Quick Select Icon:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTED_ICONS.map((iconName) => (
              <button
                key={iconName}
                type="button"
                disabled={isSubmitting}
                onClick={() =>
                  setValue("icon", iconName, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
                className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg border transition ${
                  currentIcon === iconName
                    ? "border-brand-500 bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400"
                    : "border-gray-200 bg-white hover:bg-gray-50 text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                <AppIcon icon={iconName} className="w-3.5 h-3.5" />
                <span>{iconName.replace("lucide:", "")}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Form Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-5 border-t border-gray-100 dark:border-white/[0.05]">
        <Link
          href="/category/list"
          className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700 transition"
        >
          Cancel
        </Link>
        <Button
          variant="primary"
          size="md"
          disabled={isSubmitting || (isEditMode && !isDirty)}
          startIcon={
            isSubmitting ? (
              <AppIcon icon="lucide:loader" className="w-4 h-4 animate-spin" />
            ) : (
              <AppIcon icon="lucide:check" className="w-4 h-4" />
            )
          }
        >
          {isSubmitting
            ? "Saving..."
            : isEditMode
            ? "Save Changes"
            : "Create Category"}
        </Button>
      </div>
    </form>
  );
};

export default CategoryAddEditForm;
