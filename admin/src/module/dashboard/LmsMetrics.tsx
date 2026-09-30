"use client";

import React from "react";
import Badge from "@/components/ui/badge/Badge";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  DocsIcon,
  DollarLineIcon,
  GroupIcon,
  UserCircleIcon,
} from "@/icons";

interface MetricItem {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ReactNode;
}

const metricsData: MetricItem[] = [
  {
    title: "Total Students",
    value: "12,450",
    change: "+14.5%",
    isPositive: true,
    icon: <GroupIcon className="text-brand-500 size-6 dark:text-brand-400" />,
  },
  {
    title: "Instructors",
    value: "185",
    change: "+4.2%",
    isPositive: true,
    icon: <UserCircleIcon className="text-brand-500 size-6 dark:text-brand-400" />,
  },
  {
    title: "Active Courses",
    value: "340",
    change: "+8.1%",
    isPositive: true,
    icon: <DocsIcon className="text-brand-500 size-6 dark:text-brand-400" />,
  },
  {
    title: "Platform Revenue",
    value: "$48,920",
    change: "+18.3%",
    isPositive: true,
    icon: <DollarLineIcon className="text-brand-500 size-6 dark:text-brand-400" />,
  },
];

export const LmsMetrics: React.FC = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-4">
      {metricsData.map((metric) => (
        <div
          key={metric.title}
          className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6"
        >
          <div className="flex items-center justify-center w-12 h-12 bg-brand-50 rounded-xl dark:bg-brand-500/10">
            {metric.icon}
          </div>

          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {metric.title}
              </span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {metric.value}
              </h4>
            </div>

            <Badge
              color={metric.isPositive ? "success" : "error"}
              size="sm"
              startIcon={
                metric.isPositive ? (
                  <ArrowUpIcon className="size-3" />
                ) : (
                  <ArrowDownIcon className="size-3" />
                )
              }
            >
              {metric.change}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
};
