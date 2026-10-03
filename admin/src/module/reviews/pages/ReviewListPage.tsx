"use client";

import React, { useMemo, useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { TanstackTable } from "@/components/tables/TanstackTable";
import { useReviewsList, useDeleteReview } from "@/api/hooks/reviews/hook";
import { ReviewStatsCards } from "../components/ReviewStatsCards";
import { getReviewColumns, TReviewTableItem } from "../components/reviewColumns";

export const ReviewListPage: React.FC = () => {
  const [selectedRating, setSelectedRating] = useState<string>("all");

  const { data, isLoading, error } = useReviewsList({
    rating: selectedRating !== "all" ? selectedRating : undefined,
  });

  const { mutateAsync: deleteReview } = useDeleteReview();

  const reviews = useMemo<TReviewTableItem[]>(() => {
    const list = data?.data;
    if (!Array.isArray(list)) return [];
    return list.map((item) => ({ ...item }));
  }, [data]);

  const columns = useMemo(
    () =>
      getReviewColumns({
        deleteReview,
      }),
    [deleteReview]
  );

  return (
    <div>
      <PageBreadcrumb pageTitle="Review Moderation" />

      {/* Top Metric Cards */}
      <ReviewStatsCards meta={data?.meta} />

      {/* Section Header & Rating Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white/90">
            Student Feedback & Reviews
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Monitor course quality, view student ratings, and moderate inappropriate feedback.
          </p>
        </div>

        {/* Rating Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-x-auto shrink-0">
          {[
            { label: "All Ratings", value: "all" },
            { label: "5 ★", value: "5" },
            { label: "4 ★", value: "4" },
            { label: "3 ★", value: "3" },
            { label: "2 ★", value: "2" },
            { label: "1 ★", value: "1" },
          ].map((rt) => (
            <button
              key={rt.value}
              type="button"
              onClick={() => setSelectedRating(rt.value)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
                selectedRating === rt.value
                  ? "bg-white text-gray-900 shadow-sm dark:bg-gray-900 dark:text-white"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              }`}
            >
              {rt.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 mb-4 rounded-xl border border-error-200 bg-error-50 text-error-700 text-sm">
          Failed to load reviews: {error instanceof Error ? error.message : "Unknown error"}
        </div>
      )}

      {/* Tanstack Table */}
      <TanstackTable
        columns={columns}
        data={reviews}
        isLoading={isLoading}
        searchPlaceholder="Search reviews by student name, course, or comment..."
        emptyMessage="No reviews found matching your filter criteria."
      />
    </div>
  );
};

export default ReviewListPage;
