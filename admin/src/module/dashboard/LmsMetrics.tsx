"use client";

import React from "react";
import Badge from "@/components/ui/badge/Badge";
import {
  ArrowUpIcon,
  DocsIcon,
  DollarLineIcon,
  GroupIcon,
  UserCircleIcon,
} from "@/icons";
import { useAdminDashboardAnalytics } from "@/api/hooks/dashboard/hook";

interface MetricCardProps {
  title: string;
  value: string;
  badgeText: string;
  subtitle?: string;
  icon: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  badgeText,
  subtitle,
  icon,
}) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div className="flex items-center justify-center w-12 h-12 bg-brand-50 rounded-xl dark:bg-brand-500/10">
        {icon}
      </div>
      <Badge color="success" size="sm" startIcon={<ArrowUpIcon className="size-3" />}>
        {badgeText}
      </Badge>
    </div>

    <div className="mt-4">
      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {title}
      </span>
      <h4 className="mt-1 font-bold text-gray-800 text-title-sm dark:text-white/90">
        {value}
      </h4>
      {subtitle && (
        <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
          {subtitle}
        </p>
      )}
    </div>
  </div>
);

const SkeletonCard: React.FC = () => (
  <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 animate-pulse">
    <div className="flex items-center justify-between">
      <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-gray-700" />
      <div className="w-14 h-5 rounded-full bg-gray-200 dark:bg-gray-700" />
    </div>
    <div className="mt-4 space-y-2">
      <div className="w-24 h-4 rounded bg-gray-200 dark:bg-gray-700" />
      <div className="w-32 h-7 rounded bg-gray-200 dark:bg-gray-700" />
      <div className="w-20 h-3 rounded bg-gray-200 dark:bg-gray-700" />
    </div>
  </div>
);

export const LmsMetrics: React.FC = () => {
  const { data, isLoading } = useAdminDashboardAnalytics();
  const overview = data?.data?.overview;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  const revenue = overview?.totalRevenue ?? 0;
  const enrollments = overview?.totalEnrollments ?? 0;
  const students = overview?.totalStudents ?? 0;
  const instructors = overview?.totalInstructors ?? 0;
  const courses = overview?.totalCourses ?? 0;
  const activeCourses = overview?.activeCourses ?? 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-4">
      <MetricCard
        title="Platform Revenue"
        value={`₹${revenue.toLocaleString("en-IN")}`}
        badgeText="Live"
        subtitle={`${enrollments} total enrollment${enrollments === 1 ? "" : "s"}`}
        icon={<DollarLineIcon className="text-brand-500 size-6 dark:text-brand-400" />}
      />

      <MetricCard
        title="Total Enrollments"
        value={enrollments.toLocaleString("en-IN")}
        badgeText="Active"
        subtitle={`Across all paid & free courses`}
        icon={<GroupIcon className="text-brand-500 size-6 dark:text-brand-400" />}
      />

      <MetricCard
        title="Total Courses"
        value={courses.toLocaleString("en-IN")}
        badgeText="Catalog"
        subtitle={`${activeCourses} published · ${courses - activeCourses} draft/review`}
        icon={<DocsIcon className="text-brand-500 size-6 dark:text-brand-400" />}
      />

      <MetricCard
        title="Instructors & Learners"
        value={`${instructors} / ${students}`}
        badgeText="Community"
        subtitle={`${instructors} mentors · ${students} students`}
        icon={<UserCircleIcon className="text-brand-500 size-6 dark:text-brand-400" />}
      />
    </div>
  );
};
