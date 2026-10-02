"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  userEditZodSchema,
  TUserEditFormData,
} from "../zod/user.zod";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Button from "@/components/ui/button/Button";
import { AppIcon } from "@/components/ui/app-icon";
import Badge from "@/components/ui/badge/Badge";

export interface UsersAddEditFormProps {
  initialData?: Partial<TUserEditFormData>;
  email?: string;
  roleName?: string;
  onSubmit: (data: TUserEditFormData) => Promise<void> | void;
  isSubmitting?: boolean;
}

export const UsersAddEditForm: React.FC<UsersAddEditFormProps> = ({
  initialData,
  email = "",
  roleName = "",
  onSubmit,
  isSubmitting = false,
}) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm<TUserEditFormData>({
    resolver: zodResolver(userEditZodSchema),
    defaultValues: {
      name: initialData?.name || "",
      bio: initialData?.bio || "",
      qualification: initialData?.qualification || "",
      role: initialData?.role || "",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || "",
        bio: initialData.bio || "",
        qualification: initialData.qualification || "",
        role: initialData.role || "",
      });
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Read-Only Account Identity Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.05]">
        <div>
          <Label htmlFor="email" className="text-gray-500">
            Account Email (Immutable)
          </Label>
          <div className="relative mt-1">
            <Input
              id="email"
              value={email}
              disabled
              className="bg-gray-100 dark:bg-gray-800 text-gray-500 cursor-not-allowed"
            />
            <div className="absolute inset-y-0 right-3 flex items-center text-gray-400">
              <AppIcon icon="lucide:lock" className="w-4 h-4" />
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="role" className="text-gray-500">
            Assigned Role
          </Label>
          <div className="mt-2.5">
            <Badge variant="light" color="primary" size="md">
              {roleName ? roleName.toUpperCase() : "STUDENT"}
            </Badge>
          </div>
        </div>
      </div>

      {/* Editable Fields */}
      <div className="space-y-5">
        {/* Full Name */}
        <div>
          <Label htmlFor="name">
            Full Name <span className="text-error-500">*</span>
          </Label>
          <Input
            id="name"
            placeholder="e.g. John Doe"
            error={!!errors.name}
            hint={errors.name?.message}
            disabled={isSubmitting}
            {...register("name")}
          />
        </div>

        {/* Qualification */}
        <div>
          <Label htmlFor="qualification">
            Professional Qualification / Title
          </Label>
          <Input
            id="qualification"
            placeholder="e.g. Senior Full-Stack Engineer / M.Tech in CS"
            error={!!errors.qualification}
            hint={errors.qualification?.message}
            disabled={isSubmitting}
            {...register("qualification")}
          />
        </div>

        {/* Bio Textarea */}
        <div>
          <Label htmlFor="bio">Bio & Background</Label>
          <Controller
            name="bio"
            control={control}
            render={({ field }) => (
              <TextArea
                placeholder="Brief summary of professional background, experience, or instructor bio..."
                rows={4}
                value={field.value || ""}
                onChange={field.onChange}
                error={!!errors.bio}
                hint={errors.bio?.message}
                disabled={isSubmitting}
              />
            )}
          />
        </div>
      </div>

      {/* Form Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-5 border-t border-gray-100 dark:border-white/[0.05]">
        <Link
          href="/users/list"
          className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700 transition"
        >
          Cancel
        </Link>
        <Button
          variant="primary"
          size="md"
          disabled={isSubmitting || !isDirty}
          startIcon={
            isSubmitting ? (
              <AppIcon icon="lucide:loader" className="w-4 h-4 animate-spin" />
            ) : (
              <AppIcon icon="lucide:check" className="w-4 h-4" />
            )
          }
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
};

export default UsersAddEditForm;
