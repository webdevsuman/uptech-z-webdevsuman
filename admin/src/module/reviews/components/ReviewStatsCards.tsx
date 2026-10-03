"use client";

import React from "react";
import { AppIcon } from "@/components/ui/app-icon";
import { IReviewsMeta } from "@/api/hooks/reviews/schema";

interface ReviewStatsCardsProps {
  meta?: IReviewsMeta;
}

export const ReviewStatsCards: React.FC<ReviewStatsCardsProps> = ({ meta }) => {
  const total = meta?.total ?? 0;
  const avg = meta?.averageRating ?? 0;
  const fiveStars = meta?.breakdown?.[5] ?? 0;
  const critical = (meta?.breakdown?.[1] ?? 0) + (meta?.breakdown?.[2] ?? 0);

  const stats = [
    {
      title: "Total Reviews",
      value: total.toLocaleString(),
      subtitle: "Across all courses",
      icon: "lucide:message-square",
      color: "text-brand-500 bg-brand-50 dark:bg-brand-900/20",
    },
    {
      title: "Average Rating",
      value: avg > 0 ? `${avg.toFixed(1)} ★` : "N/A",
      subtitle: "Platform-wide score",
      icon: "lucide:star",
      color: "text-amber-500 bg-amber-50 dark:bg-amber-900/20",
    },
    {
      title: "5-Star Praise",
      value: fiveStars.toLocaleString(),
      subtitle: `${total > 0 ? Math.round((fiveStars / total) * 100) : 0}% of all feedback`,
      icon: "lucide:thumbs-up",
      color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20",
    },
    {
      title: "Critical Feedback",
      value: critical.toLocaleString(),
      subtitle: "1-2 star ratings",
      icon: "lucide:alert-circle",
      color: "text-rose-500 bg-rose-50 dark:bg-rose-900/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {stat.title}
            </span>
            <div className={`p-2.5 rounded-xl ${stat.color}`}>
              <AppIcon icon={stat.icon} className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">
            {stat.value}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {stat.subtitle}
          </p>
        </div>
      ))}
    </div>
  );
};
