import React from "react";
import { ICourseItem } from "@/api/hooks/course/schema";
import { CourseStatusBadge } from "./CourseStatusBadge";
import Badge from "@/components/ui/badge/Badge";
import { AppIcon } from "@/components/ui/app-icon";

interface CourseHeroOverviewProps {
  course: ICourseItem;
}

export const CourseHeroOverview: React.FC<CourseHeroOverviewProps> = ({ course }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <CourseStatusBadge status={course.status} />
            <Badge variant="light" color="info" size="sm">
              {course.category?.name || "General"}
            </Badge>
            <Badge variant="light" color="light" size="sm">
              {course.level?.toUpperCase().replace("_", " ") || "ALL LEVELS"}
            </Badge>
            <Badge variant="light" color="light" size="sm">
              {course.language || "English"}
            </Badge>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {course.title}
          </h1>
          {course.subtitle && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              {course.subtitle}
            </p>
          )}

          <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line border-t border-gray-100 dark:border-gray-700 pt-4">
            {course.description || "No description provided."}
          </div>
        </div>
      </div>

      {/* Sidebar Cards */}
      <div className="space-y-6">
        {/* Thumbnail & Pricing */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700">
          <div className="aspect-video w-full rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 mb-4">
            {course.thumbnail?.url ? (
              <img
                src={course.thumbnail.url}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <AppIcon icon="lucide:book-open" className="w-8 h-8" />
              </div>
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Price</span>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              {course.price && course.price > 0 ? `$${course.price.toFixed(2)}` : "Free"}
            </span>
          </div>
        </div>

        {/* Instructor Info */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
            Instructor
          </h3>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-50 text-brand-500 flex items-center justify-center font-bold">
              {course.instructor?.name?.charAt(0) || "I"}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800 dark:text-white">
                {course.instructor?.name || "Instructor"}
              </p>
              <p className="text-xs text-gray-500">{course.instructor?.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseHeroOverview;
