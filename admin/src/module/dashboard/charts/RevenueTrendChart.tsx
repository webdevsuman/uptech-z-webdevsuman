"use client";

import React from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { IMonthlyTrend } from "@/api/hooks/dashboard/schema";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface RevenueTrendChartProps {
  data?: IMonthlyTrend[];
  isLoading?: boolean;
}

export const RevenueTrendChart: React.FC<RevenueTrendChartProps> = ({
  data = [],
  isLoading = false,
}) => {
  const categories = data.map((d) => d.month);
  const revenueSeries = data.map((d) => d.revenue);
  const enrollmentSeries = data.map((d) => d.enrollments);

  const options: ApexOptions = {
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "area",
      height: 310,
      toolbar: { show: false },
    },
    colors: ["#465FFF", "#10B981"],
    stroke: {
      curve: "smooth",
      width: [3, 2],
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
      },
    },
    markers: {
      size: 4,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: { size: 6 },
    },
    grid: {
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
      borderColor: "#f1f1f1",
    },
    dataLabels: { enabled: false },
    xaxis: {
      type: "category",
      categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: { colors: "#9CA3AF", fontSize: "12px" },
      },
    },
    yaxis: [
      {
        title: {
          text: "Revenue (₹)",
          style: { color: "#465FFF", fontSize: "12px", fontWeight: 500 },
        },
        labels: {
          formatter: (val: number) => `₹${val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}`,
          style: { colors: "#6B7280", fontSize: "12px" },
        },
      },
      {
        opposite: true,
        title: {
          text: "Enrollments",
          style: { color: "#10B981", fontSize: "12px", fontWeight: 500 },
        },
        labels: {
          formatter: (val: number) => `${Math.round(val)}`,
          style: { colors: "#6B7280", fontSize: "12px" },
        },
      },
    ],
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "right",
      fontFamily: "Outfit",
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (val: number, { seriesIndex }) =>
          seriesIndex === 0 ? `₹${val.toLocaleString("en-IN")}` : `${val} students`,
      },
    },
  };

  const series = [
    {
      name: "Revenue",
      data: revenueSeries,
    },
    {
      name: "Enrollments",
      data: enrollmentSeries,
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
            Revenue & Enrollment Trends
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Platform earning and learner enrollment over the last 6 months
          </p>
        </div>
      </div>

      <div className="mt-4">
        <ReactApexChart
          options={options}
          series={series}
          type="area"
          height={310}
        />
      </div>
    </div>
  );
};
