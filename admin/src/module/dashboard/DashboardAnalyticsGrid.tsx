"use client";

import React from "react";
import { useAdminDashboardAnalytics } from "@/api/hooks/dashboard/hook";
import { RevenueTrendChart } from "./charts/RevenueTrendChart";
import { TopRevenueCoursesChart } from "./charts/TopRevenueCoursesChart";
import { TopInstructorsCard } from "./charts/TopInstructorsCard";
import { CategoryDistributionChart } from "./charts/CategoryDistributionChart";

export const DashboardAnalyticsGrid: React.FC = () => {
  const { data, isLoading } = useAdminDashboardAnalytics();
  const analytics = data?.data;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RevenueTrendChart
          data={analytics?.monthlyTrends}
          isLoading={isLoading}
        />
        <TopRevenueCoursesChart
          data={analytics?.topRevenueCourses}
          isLoading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CategoryDistributionChart
          data={analytics?.categoryDistribution}
          isLoading={isLoading}
        />
        <TopInstructorsCard
          data={analytics?.topInstructors}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
