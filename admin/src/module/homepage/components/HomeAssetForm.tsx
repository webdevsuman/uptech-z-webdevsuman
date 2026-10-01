"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  homeAssetZodSchema,
  THomeAssetFormData,
} from "../zod/homepage.zod";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Button from "@/components/ui/button/Button";
import { AppIcon } from "@/components/ui/app-icon";

export interface HomeAssetFormProps {
  onSubmit: (data: THomeAssetFormData) => Promise<void> | void;
  isSubmitting?: boolean;
}

export const HomeAssetForm: React.FC<HomeAssetFormProps> = ({
  onSubmit,
  isSubmitting = false,
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<THomeAssetFormData>({
    resolver: zodResolver(homeAssetZodSchema),
    defaultValues: {
      section: "",
      title: "",
      description: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Section Input */}
      <div>
        <Label htmlFor="section">
          Section Name <span className="text-error-500">*</span>
        </Label>
        <Input
          id="section"
          placeholder="e.g. Hero, Highlights, Features, CTA"
          error={!!errors.section}
          hint={errors.section?.message}
          disabled={isSubmitting}
          {...register("section")}
        />
      </div>

      {/* Title Input */}
      <div>
        <Label htmlFor="title">
          Title <span className="text-error-500">*</span>
        </Label>
        <Input
          id="title"
          placeholder="e.g. Welcome to UpTech-Z Learning"
          error={!!errors.title}
          hint={errors.title?.message}
          disabled={isSubmitting}
          {...register("title")}
        />
      </div>

      {/* Description Textarea */}
      <div>
        <Label htmlFor="description">
          Description <span className="text-error-500">*</span>
        </Label>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TextArea
              placeholder="Detailed description or content for this section..."
              rows={4}
              value={field.value}
              onChange={field.onChange}
              error={!!errors.description}
              hint={errors.description?.message}
              disabled={isSubmitting}
            />
          )}
        />
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
        <Button
          variant="primary"
          size="md"
          disabled={isSubmitting}
          className="min-w-[140px]"
          startIcon={
            isSubmitting ? (
              <AppIcon icon="lucide:loader" className="w-4 h-4 animate-spin" />
            ) : (
              <AppIcon icon="lucide:plus" className="w-4 h-4" />
            )
          }
        >
          {isSubmitting ? "Creating..." : "Create Asset"}
        </Button>
      </div>
    </form>
  );
};

export default HomeAssetForm;
