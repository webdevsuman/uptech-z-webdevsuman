"use client";

import React from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { ICategoryDistribution } from "@/api/hooks/dashboard/schema";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface CategoryDistributionChartProps {
  data?: ICategoryDistribution[];
  isLoading?: boolean;
}

export const CategoryDistributionChart: React.FC<CategoryDistributionChartProps> = ({
  data = [],
  isLoading = false,
}) => {
  const labels = data.map((c) => c.name);
  const series = data.map((c) => c.count);

  const options: ApexOptions = {
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "donut",
      height: 310,
    },
    labels,
    colors: ["#465FFF", "#0BA5EC", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899"],
    dataLabels: { enabled: false },
    stroke: { show: false },
    plotOptions: {
      pie: {
        donut: {
          size: "68%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Courses",
              formatter: () => `${series.reduce((a, b) => a + b, 0)}`,
            },
          },
        },
      },
    },
    legend: {
      position: "bottom",
      horizontalAlign: "center",
      fontSize: "12px",
      fontFamily: "Outfit",
      markers: {
        size: 5,
      },
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val} courses`,
      },
    },
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 animate-pulse h-[390px] flex flex-col justify-between">
        <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="w-48 h-48 rounded-full bg-gray-100 dark:bg-gray-800/40 mx-auto my-auto" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
        <div>
          <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
            Course Distribution by Category
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Breakdown of courses across disciplines
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center">
        {series.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[310px] text-gray-400 text-sm">
            <p>No categories or courses found.</p>
          </div>
        ) : (
          <ReactApexChart
            options={options}
            series={series}
            type="donut"
            height={310}
          />
        )}
      </div>
    </div>
  );
};
