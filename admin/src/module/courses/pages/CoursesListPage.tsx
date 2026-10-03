"use client";

import React, { useMemo, useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { TanstackTable } from "@/components/tables/TanstackTable";
import {
  useAdminCoursesList,
  useToggleCourseFeatured,
  useToggleCourseTrending,
  useDeleteCourse,
} from "@/api/hooks/course/hook";
import { ICourseItem } from "@/api/hooks/course/schema";
import { CourseStatusModal } from "../components/CourseStatusModal";
import {
  getCourseColumns,
  TCourseTableItem,
} from "../components/courseColumns";

export const CoursesListPage: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [activeCourse, setActiveCourse] = useState<ICourseItem | null>(null);

  const { data, isLoading, error } = useAdminCoursesList({
    status: selectedStatus !== "all" ? selectedStatus : undefined,
  });

  const { mutateAsync: toggleFeatured } = useToggleCourseFeatured();
  const { mutateAsync: toggleTrending } = useToggleCourseTrending();
  const { mutateAsync: deleteCourse } = useDeleteCourse();

  const courses = useMemo<TCourseTableItem[]>(() => {
    const list = data?.data;
    if (!Array.isArray(list)) return [];
    return list.map((item) => ({ ...item }));
  }, [data]);

  const columns = useMemo(
    () =>
      getCourseColumns({
        toggleFeatured,
        toggleTrending,
        deleteCourse,
        onModerateStatus: (course) => setActiveCourse(course),
      }),
    [toggleFeatured, toggleTrending, deleteCourse]
  );

  return (
    <div>
      <PageBreadcrumb pageTitle="Courses" />

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white/90">
            Course Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Review instructor submissions, approve or reject courses, and manage visibility.
          </p>
        </div>

        {/* Status filter tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-x-auto">
          {["all", "under_review", "published", "draft", "rejected"].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition ${
                selectedStatus === st
                  ? "bg-white text-gray-900 shadow-sm dark:bg-gray-900 dark:text-white"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              }`}
            >
              {st.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 mb-4 rounded-xl border border-error-200 bg-error-50 text-error-700 text-sm">
          Failed to load courses: {error.message}
        </div>
      )}

      <TanstackTable
        columns={columns}
        data={courses}
        isLoading={isLoading}
        searchPlaceholder="Search courses by title, subtitle, or instructor..."
        emptyMessage="No courses found."
      />

      <CourseStatusModal
        isOpen={!!activeCourse}
        onClose={() => setActiveCourse(null)}
        course={activeCourse}
      />
    </div>
  );
};

export default CoursesListPage;
