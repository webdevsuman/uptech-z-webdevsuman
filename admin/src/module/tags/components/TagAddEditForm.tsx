"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";
import { AppIcon } from "@/components/ui/app-icon";
import { ROUTES } from "@/navigation/sidebar/routes";
import { tagZodSchema, TTagFormData } from "../zod/tag.zod";

export interface TagAddEditFormProps {
  initialData?: Partial<TTagFormData>;
  onSubmit: (data: TTagFormData) => Promise<void> | void;
  isSubmitting?: boolean;
  isEditMode?: boolean;
}

export const TagAddEditForm: React.FC<TagAddEditFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting = false,
  isEditMode = false,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isDirty },
  } = useForm<TTagFormData>({
    resolver: zodResolver(tagZodSchema),
    defaultValues: {
      name: initialData?.name || "",
    },
  });

  const currentName = useWatch({ control, name: "name" });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || "",
      });
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Tag Name Input */}
      <div>
        <Label htmlFor="tag-name">
          Tag Name <span className="text-error-500">*</span>
        </Label>
        <Input
          id="tag-name"
          type="text"
          placeholder="e.g. React, Next.js, Python, Machine Learning"
          {...register("name")}
          error={Boolean(errors.name)}
          disabled={isSubmitting}
        />
        {errors.name && (
          <p className="mt-1 text-xs text-error-500">{errors.name.message}</p>
        )}
      </div>

      {/* Live Badge Preview */}
      <div>
        <span className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
          Badge Preview
        </span>
        <div className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 bg-gray-50 dark:border-white/[0.05] dark:bg-white/[0.02]">
          <Badge variant="light" color="primary" size="md">
            #{currentName?.trim() || "tag-preview"}
          </Badge>
          <span className="text-xs text-gray-400">
            This is how the tag will appear to students on course cards and filters.
          </span>
        </div>
      </div>

      {/* Form Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-5 border-t border-gray-100 dark:border-white/[0.05]">
        <Link
          href={ROUTES.tags.list}
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
            : "Create Tag"}
        </Button>
      </div>
    </form>
  );
};

export default TagAddEditForm;
