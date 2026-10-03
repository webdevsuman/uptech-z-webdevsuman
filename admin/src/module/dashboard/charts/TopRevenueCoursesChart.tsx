"use client";

import React from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { ITopRevenueCourse } from "@/api/hooks/dashboard/schema";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface TopRevenueCoursesChartProps {
  data?: ITopRevenueCourse[];
  isLoading?: boolean;
}

export const TopRevenueCoursesChart: React.FC<TopRevenueCoursesChartProps> = ({
  data = [],
  isLoading = false,
}) => {
  const truncatedTitles = data.map((c) =>
    c.title.length > 28 ? `${c.title.slice(0, 25)}...` : c.title
  );
  const revenueValues = data.map((c) => c.revenue);

  const options: ApexOptions = {
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 310,
      toolbar: { show: false },
    },
    colors: ["#7950F2"],
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: "55%",
        borderRadius: 6,
        borderRadiusApplication: "end",
        dataLabels: {
          position: "top",
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `₹${val.toLocaleString("en-IN")}`,
      offsetX: 25,
      style: {
        fontSize: "11px",
        colors: ["#6B7280"],
        fontWeight: 600,
      },
    },
    grid: {
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: false } },
      borderColor: "#f1f1f1",
    },
    xaxis: {
      categories: truncatedTitles,
      labels: {
        formatter: (val: string) => `₹${Number(val).toLocaleString("en-IN")}`,
        style: { colors: "#9CA3AF", fontSize: "11px" },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { colors: "#374151", fontSize: "12px", fontWeight: 500 },
      },
    },
    tooltip: {
      y: {
        formatter: (val: number, { dataPointIndex }) => {
          const item = data[dataPointIndex];
          const enrollments = item ? item.enrollmentsCount : 0;
          return `₹${val.toLocaleString("en-IN")} (${enrollments} enrollment${enrollments === 1 ? "" : "s"})`;
        },
      },
    },
  };

  const series = [
    {
      name: "Total Revenue",
      data: revenueValues,
    },
  ];

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 animate-pulse h-[390px] flex flex-col justify-between">
        <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-64 bg-gray-100 dark:bg-gray-800/40 rounded" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
        <div>
          <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
            Top Revenue Generating Courses
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Highest earning courses ranked by cumulative sales
          </p>
        </div>
      </div>

      <div className="mt-4">
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[310px] text-gray-400 text-sm">
            <p>No enrollment revenue recorded yet.</p>
          </div>
        ) : (
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={310}
          />
        )}
      </div>
    </div>
  );
};
