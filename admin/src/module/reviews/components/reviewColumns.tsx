import React from "react";
import { TableOptions } from "@tanstack/react-table";
import { TAppTableFeatures } from "@/components/tables/TanstackTable";
import { IReviewItem } from "@/api/hooks/reviews/schema";
import { AppIcon } from "@/components/ui/app-icon";
import Badge from "@/components/ui/badge/Badge";
import { sToast } from "@/components/ui/alert/stoast";

export type TReviewTableItem = IReviewItem & Record<string, unknown>;

interface GetReviewColumnsOptions {
  deleteReview: (params: { id: string }) => Promise<unknown>;
}

export const getReviewColumns = ({
  deleteReview,
}: GetReviewColumnsOptions): TableOptions<TAppTableFeatures, TReviewTableItem>["columns"] => [
  {
    accessorKey: "student",
    header: () => "Student",
    cell: ({ row }) => {
      const student = row.original.student;
      const initial = student?.name?.[0]?.toUpperCase() || "S";
      return (
        <div className="flex items-center gap-3 min-w-[200px]">
          <div className="w-10 h-10 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold flex items-center justify-center shrink-0 border border-brand-500/20 text-sm overflow-hidden">
            {student?.profilePicture ? (
              <img
                src={student.profilePicture}
                alt={student.name}
                className="w-full h-full object-cover"
              />
            ) : (
              initial
            )}
          </div>
          <div>
            <p className="font-semibold text-sm text-gray-800 dark:text-white/90">
              {student?.name || "Student"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {student?.email || "No email"}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "course",
    header: () => "Course",
    cell: ({ row }) => {
      const course = row.original.course;
      const thumbUrl =
        typeof course?.thumbnail === "object" && course?.thumbnail !== null
          ? course.thumbnail.url
          : typeof course?.thumbnail === "string"
          ? course.thumbnail
          : undefined;

      return (
        <div className="flex items-center gap-2.5 min-w-[220px]">
          <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden shrink-0 border border-gray-200 dark:border-gray-700 flex items-center justify-center">
            {thumbUrl ? (
              <img
                src={thumbUrl}
                alt={course?.title || "Course"}
                className="w-full h-full object-cover"
              />
            ) : (
              <AppIcon icon="lucide:book-open" className="w-4 h-4 text-gray-400" />
            )}
          </div>
          <p
            className="text-sm font-medium text-gray-800 dark:text-white/90 line-clamp-1"
            title={course?.title}
          >
            {course?.title || "Untitled Course"}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "rating",
    header: () => "Rating",
    cell: ({ row }) => {
      const rating = row.original.rating;
      const isHigh = rating >= 4;
      const isLow = rating <= 2;

      return (
        <div className="flex items-center gap-1.5">
          <Badge
            variant="light"
            color={isHigh ? "success" : isLow ? "error" : "warning"}
            size="sm"
          >
            <span className="flex items-center gap-1 font-bold">
              {rating}
              <AppIcon icon="lucide:star" className="w-3 h-3 fill-current" />
            </span>
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "comment",
    header: () => "Student Feedback",
    cell: ({ row }) => (
      <p
        className="text-sm text-gray-600 dark:text-gray-300 max-w-[340px] line-clamp-2 leading-relaxed"
        title={row.original.comment}
      >
        &ldquo;{row.original.comment}&rdquo;
      </p>
    ),
  },
  {
    accessorKey: "createdAt",
    header: () => "Submitted Date",
    cell: ({ row }) => (
      <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
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
        <button
          type="button"
          onClick={() =>
            table.options.meta?.confirm({
              title: "Delete this review?",
              description: `Are you sure you want to remove the review from "${row.original.student?.name || "Student"}"? This will recalculate the course rating automatically.`,
              confirmText: "Delete",
              variant: "danger",
              onConfirm: async () => {
                try {
                  await deleteReview({ id: row.original._id });
                  sToast.success("Review removed successfully");
                } catch (err: unknown) {
                  const message =
                    err instanceof Error ? err.message : "Failed to delete review";
                  sToast.error(message);
                }
              },
            })
          }
          className="p-1.5 text-gray-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 transition"
          title="Delete Review"
        >
          <AppIcon icon="lucide:trash-2" className="w-4 h-4" />
        </button>
      </div>
    ),
  },
];
