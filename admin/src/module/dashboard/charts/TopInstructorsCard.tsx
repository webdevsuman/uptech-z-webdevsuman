"use client";

import React from "react";
import Image from "next/image";
import { ITopInstructor } from "@/api/hooks/dashboard/schema";
import { mediaUrl } from "@/api/endpoints";

interface TopInstructorsCardProps {
  data?: ITopInstructor[];
  isLoading?: boolean;
}

export const TopInstructorsCard: React.FC<TopInstructorsCardProps> = ({
  data = [],
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 animate-pulse h-[390px] flex flex-col justify-between">
        <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="space-y-4 my-auto">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="space-y-2 flex-1">
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-3 w-20 bg-gray-100 dark:bg-gray-800 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 shadow-sm flex flex-col justify-between">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
        <div>
          <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
            Top Instructors Leaderboard
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Ranked by enrolled students & active courses
          </p>
        </div>
      </div>

      <div className="mt-4 divide-y divide-gray-100 dark:divide-gray-800/60 overflow-y-auto max-h-[310px]">
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400 text-sm">
            <p>No instructors with courses found.</p>
          </div>
        ) : (
          data.map((instructor, index) => {
            const avatarSrc = instructor.profilePicture
              ? mediaUrl(instructor.profilePicture)
              : null;

            return (
              <div
                key={instructor.instructorId || index}
                className="py-3 flex items-center justify-between gap-3 hover:bg-gray-50/50 dark:hover:bg-white/[0.01] rounded-lg px-2 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold shrink-0 ${
                      index === 0
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300"
                        : index === 1
                        ? "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                        : index === 2
                        ? "bg-amber-700/10 text-amber-800 dark:bg-amber-700/20 dark:text-amber-400"
                        : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                    }`}
                  >
                    {index + 1}
                  </span>

                  <div className="w-10 h-10 rounded-full overflow-hidden bg-brand-50 border border-gray-100 dark:border-gray-700 shrink-0 flex items-center justify-center font-bold text-brand-600 text-sm">
                    {avatarSrc ? (
                      <Image
                        src={avatarSrc}
                        alt={instructor.name}
                        width={40}
                        height={40}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      instructor.name.slice(0, 2).toUpperCase()
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 dark:text-white/90 truncate">
                      {instructor.name}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {instructor.coursesCount} course{instructor.coursesCount === 1 ? "" : "s"} ·{" "}
                      {instructor.studentsCount} student{instructor.studentsCount === 1 ? "" : "s"}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    ₹{instructor.totalRevenue.toLocaleString("en-IN")}
                  </span>
                  <p className="text-[11px] text-gray-400">revenue</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
