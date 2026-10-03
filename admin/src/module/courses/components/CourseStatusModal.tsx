"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import { AppIcon } from "@/components/ui/app-icon";
import { sToast } from "@/components/ui/alert/stoast";
import { ICourseItem, TCourseStatus } from "@/api/hooks/course/schema";
import { useUpdateCourseStatus } from "@/api/hooks/course/hook";
import {
  courseStatusSchema,
  CourseStatusFormData,
} from "../zod/courseStatus.zod";

interface CourseStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: ICourseItem | null;
}

export const CourseStatusModal: React.FC<CourseStatusModalProps> = ({
  isOpen,
  onClose,
  course,
}) => {
  const { mutateAsync: updateStatus, isPending } = useUpdateCourseStatus();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CourseStatusFormData>({
    resolver: zodResolver(courseStatusSchema),
    defaultValues: {
      status: "under_review",
    },
  });

  const selectedStatus = watch("status");

  useEffect(() => {
    if (course && isOpen) {
      reset({
        status: course.status,
      });
    }
  }, [course, isOpen, reset]);

  const onSubmit = async (data: CourseStatusFormData) => {
    if (!course) return;

    try {
      await updateStatus({
        id: course._id,
        status: data.status,
      });
      sToast.success(`Course status updated to ${data.status.replace("_", " ")}`);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update course status";
      sToast.error(msg);
    }
  };

  const statusOptions: { value: TCourseStatus; label: string; desc: string; icon: string; color: string }[] = [
    {
      value: "published",
      label: "Approve & Publish",
      desc: "Course will be visible to all students on the public store.",
      icon: "lucide:check-circle-2",
      color: "border-success-500 bg-success-50/30 text-success-700 dark:border-success-400 dark:bg-success-500/10 dark:text-success-400",
    },
    {
      value: "rejected",
      label: "Reject Course",
      desc: "Course is rejected. The instructor must address issues before resubmitting.",
      icon: "lucide:x-circle",
      color: "border-error-500 bg-error-50/30 text-error-700 dark:border-error-400 dark:bg-error-500/10 dark:text-error-400",
    },
    {
      value: "under_review",
      label: "Under Review",
      desc: "Keep course in review queue for curriculum inspection.",
      icon: "lucide:clock",
      color: "border-warning-500 bg-warning-50/30 text-warning-700 dark:border-warning-400 dark:bg-warning-500/10 dark:text-warning-400",
    },
    {
      value: "draft",
      label: "Revert to Draft",
      desc: "Return course to draft status. Only the instructor can view it.",
      icon: "lucide:file-edit",
      color: "border-gray-400 bg-gray-50 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300",
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg p-6">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-gray-800">
        <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-500 flex items-center justify-center dark:bg-brand-500/10 dark:text-brand-400">
          <AppIcon icon="lucide:shield-check" className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-white/90">
            Course Moderation
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {course?.title || "Selected Course"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Select Decision
          </label>
          <div className="grid grid-cols-1 gap-2.5">
            {statusOptions.map((opt) => {
              const isSelected = selectedStatus === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setValue("status", opt.value)}
                  className={`flex items-start gap-3 p-3 rounded-xl border text-left transition ${
                    isSelected
                      ? `${opt.color} ring-2 ring-brand-500 shadow-sm`
                      : "border-gray-200 hover:border-gray-300 bg-white dark:bg-gray-800/40 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  <AppIcon icon={opt.icon} className="w-5 h-5 mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-bold">{opt.label}</p>
                    <p className="text-xs opacity-80 mt-0.5">{opt.desc}</p>
                  </div>
                  {isSelected && (
                    <AppIcon icon="lucide:check" className="w-4 h-4 shrink-0 text-brand-500" />
                  )}
                </button>
              );
            })}
          </div>
          {errors.status && (
            <p className="text-xs text-error-500 mt-1">{errors.status.message}</p>
          )}
          <input type="hidden" {...register("status")} />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={isPending}
            startIcon={
              isPending ? (
                <AppIcon icon="lucide:loader" className="w-4 h-4 animate-spin" />
              ) : (
                <AppIcon icon="lucide:save" className="w-4 h-4" />
              )
            }
          >
            {isPending ? "Updating..." : "Confirm Decision"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CourseStatusModal;
