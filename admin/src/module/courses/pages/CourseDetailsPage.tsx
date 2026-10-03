"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import { AppIcon } from "@/components/ui/app-icon";
import { sToast } from "@/components/ui/alert/stoast";
import { ROUTES } from "@/navigation/sidebar/routes";
import {
  useCourseDetails,
  useToggleCourseFeatured,
  useToggleCourseTrending,
  useDeleteCourse,
} from "@/api/hooks/course/hook";
import { CourseStatusModal } from "../components/CourseStatusModal";
import { CourseHeroOverview } from "../components/CourseHeroOverview";
import { CurriculumAccordion } from "../components/CurriculumAccordion";

interface CourseDetailsPageProps {
  courseId: string;
}

export const CourseDetailsPage: React.FC<CourseDetailsPageProps> = ({ courseId }) => {
  const router = useRouter();
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const { data: response, isLoading, error } = useCourseDetails(courseId);
  const course = response?.data;

  const { mutateAsync: toggleFeatured, isPending: isTogglingFeatured } =
    useToggleCourseFeatured();
  const { mutateAsync: toggleTrending, isPending: isTogglingTrending } =
    useToggleCourseTrending();
  const { mutateAsync: deleteCourse, isPending: isDeleting } = useDeleteCourse();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <AppIcon icon="lucide:loader" className="w-8 h-8 animate-spin text-brand-500" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="p-8 text-center bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
        <AppIcon icon="lucide:alert-circle" className="w-10 h-10 text-error-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-gray-800 dark:text-white">Course Not Found</h2>
        <p className="text-sm text-gray-500 mt-1 mb-4">
          The requested course could not be retrieved or does not exist.
        </p>
        <Link href={ROUTES.courses.list}>
          <Button variant="outline" size="sm">Back to Courses</Button>
        </Link>
      </div>
    );
  }

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${course.title}"?`)) return;
    try {
      await deleteCourse(course._id);
      sToast.success("Course deleted successfully");
      router.push(ROUTES.courses.list);
    } catch {
      sToast.error("Failed to delete course");
    }
  };

  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="Course Details" showBack={false} />

      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-800">
        <Link
          href={ROUTES.courses.list}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-brand-500 transition"
        >
          <AppIcon icon="lucide:arrow-left" className="w-4 h-4" />
          Back to Courses
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={async () => {
              await toggleFeatured({ id: course._id, isFeatured: !course.isFeatured });
              sToast.success(`Course ${!course.isFeatured ? "featured" : "unfeatured"}`);
            }}
            disabled={isTogglingFeatured}
            startIcon={<AppIcon icon="lucide:star" className="w-4 h-4" />}
          >
            {course.isFeatured ? "Featured" : "Mark Featured"}
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={async () => {
              await toggleTrending({ id: course._id, isTrending: !course.isTrending });
              sToast.success(`Course ${!course.isTrending ? "trending" : "untrending"}`);
            }}
            disabled={isTogglingTrending}
            startIcon={<AppIcon icon="lucide:flame" className="w-4 h-4" />}
          >
            {course.isTrending ? "Trending" : "Mark Trending"}
          </Button>

          <Button
            size="sm"
            onClick={() => setIsStatusModalOpen(true)}
            startIcon={<AppIcon icon="lucide:shield-check" className="w-4 h-4" />}
          >
            Moderate Status
          </Button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 text-error-600 hover:bg-error-50 dark:hover:bg-error-500/10 rounded-lg transition"
            title="Delete Course"
          >
            <AppIcon icon="lucide:trash-2" className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Course Hero & Overview */}
      <CourseHeroOverview course={course} />

      {/* Deep Curriculum Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Course Curriculum & Syllabus
          </h2>
          <span className="text-xs text-gray-500">
            {course.sections?.length || 0} sections •{" "}
            {course.sections?.reduce((a, s) => a + (s.lectures?.length || 0), 0) || 0} lectures
          </span>
        </div>
        <CurriculumAccordion sections={course.sections} />
      </div>

      <CourseStatusModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        course={course}
      />
    </div>
  );
};

export default CourseDetailsPage;
