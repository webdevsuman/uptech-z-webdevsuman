"use client";

import React from "react";

export const DashboardHeader: React.FC = () => {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-6">
      <div>
        <h1 className="text-xl font-bold text-gray-800 dark:text-white/90 sm:text-2xl">
          Welcome to UpTech-Z Admin Panel
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Monitor platform performance, manage instructors, courses, and student enrollments.
        </p>
      </div>
    </div>
  );
};
