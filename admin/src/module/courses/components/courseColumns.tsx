import React from "react";
import Link from "next/link";
import { TableOptions } from "@tanstack/react-table";
import { TAppTableFeatures } from "@/components/tables/TanstackTable";
import { ICourseItem, TCourseStatus } from "@/api/hooks/course/schema";
import { CourseStatusBadge } from "./CourseStatusBadge";
import { AppIcon } from "@/components/ui/app-icon";
import Badge from "@/components/ui/badge/Badge";
import { ROUTES } from "@/navigation/sidebar/routes";
import { sToast } from "@/components/ui/alert/stoast";

export type TCourseTableItem = ICourseItem & Record<string, unknown>;

interface GetCourseColumnsOptions {
  toggleFeatured: (params: { id: string; isFeatured: boolean }) => Promise<unknown>;
  toggleTrending: (params: { id: string; isTrending: boolean }) => Promise<unknown>;
  deleteCourse: (id: string) => Promise<unknown>;
  onModerateStatus: (course: ICourseItem) => void;
}

export const getCourseColumns = ({
  toggleFeatured,
  toggleTrending,
  deleteCourse,
  onModerateStatus,
}: GetCourseColumnsOptions): TableOptions<TAppTableFeatures, TCourseTableItem>["columns"] => [
  {
    accessorKey: "title",
    header: () => "Course",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <div className="flex items-center gap-3 min-w-[240px]">
          <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-200 dark:border-gray-700 flex items-center justify-center">
            {item.thumbnail?.url ? (
              <img
                src={item.thumbnail.url}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <AppIcon icon="lucide:book-open" className="w-5 h-5 text-gray-400" />
            )}
          </div>
          <div>
            <Link
              href={ROUTES.courses.details(item._id)}
              className="font-semibold text-gray-800 dark:text-white/90 hover:text-brand-500 transition line-clamp-1"
              title={item.title}
            >
              {item.title}
            </Link>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {item.sectionsCount ?? 0} sections • {item.lecturesCount ?? 0} lectures
            </p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "instructor",
    header: () => "Instructor",
    cell: ({ row }) => (
      <div>
        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
          {row.original.instructor?.name || "N/A"}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {row.original.instructor?.email || ""}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: () => "Category",
    cell: ({ row }) => (
      <Badge variant="light" color="info" size="sm">
        {row.original.category?.name || "General"}
      </Badge>
    ),
  },
  {
    accessorKey: "price",
    header: () => "Price",
    cell: ({ row }) => {
      const p = row.original.price;
      return (
        <span className="font-semibold text-sm text-gray-800 dark:text-white">
          {p && p > 0 ? `$${p.toFixed(2)}` : "Free"}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => "Status",
    cell: ({ row }) => (
      <button
        type="button"
        onClick={() => onModerateStatus(row.original)}
        className="cursor-pointer hover:opacity-80 transition"
        title="Click to moderate status"
      >
        <CourseStatusBadge status={row.original.status as TCourseStatus} />
      </button>
    ),
  },
  {
    accessorKey: "isFeatured",
    header: () => "Featured",
    cell: ({ row }) => {
      const isFeatured = row.original.isFeatured;
      return (
        <button
          type="button"
          onClick={async () => {
            await toggleFeatured({ id: row.original._id, isFeatured: !isFeatured });
            sToast.success(`Course ${!isFeatured ? "marked featured" : "unmarked"}`);
          }}
          className={`p-1.5 rounded-lg transition ${
            isFeatured
              ? "text-brand-500 bg-brand-50 dark:bg-brand-500/10"
              : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          }`}
          title={isFeatured ? "Featured" : "Not featured"}
        >
          <AppIcon icon={isFeatured ? "lucide:star" : "lucide:star-off"} className="w-4 h-4" />
        </button>
      );
    },
  },
  {
    accessorKey: "isTrending",
    header: () => "Trending",
    cell: ({ row }) => {
      const isTrending = row.original.isTrending;
      return (
        <button
          type="button"
          onClick={async () => {
            await toggleTrending({ id: row.original._id, isTrending: !isTrending });
            sToast.success(`Course ${!isTrending ? "marked trending" : "unmarked"}`);
          }}
          className={`p-1.5 rounded-lg transition ${
            isTrending
              ? "text-orange-500 bg-orange-50 dark:bg-orange-500/10"
              : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          }`}
          title={isTrending ? "Trending" : "Not trending"}
        >
          <AppIcon icon={isTrending ? "lucide:flame" : "lucide:flame"} className="w-4 h-4" />
        </button>
      );
    },
  },
  {
    id: "actions",
    header: () => "Actions",
    cell: ({ row, table }) => (
      <div className="flex items-center gap-1.5">
        <Link
          href={ROUTES.courses.details(row.original._id)}
          className="p-1.5 text-gray-500 hover:text-brand-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          title="Review Course & Curriculum"
        >
          <AppIcon icon="lucide:eye" className="w-4 h-4" />
        </Link>
        <button
          type="button"
          onClick={() => onModerateStatus(row.original)}
          className="p-1.5 text-gray-500 hover:text-brand-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          title="Moderate Status"
        >
          <AppIcon icon="lucide:shield-check" className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() =>
            table.options.meta?.confirm({
              title: `delete course "${row.original.title}"?`,
              confirmText: "Delete Course",
              variant: "danger",
              onConfirm: async () => {
                await deleteCourse(row.original._id);
                sToast.success("Course deleted successfully");
              },
            })
          }
          className="p-1.5 text-gray-500 hover:text-error-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          title="Delete Course"
        >
          <AppIcon icon="lucide:trash-2" className="w-4 h-4" />
        </button>
      </div>
    ),
  },
];
