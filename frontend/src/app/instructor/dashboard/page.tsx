"use client";

import React from "react";
import { Stack, Grid } from "@mui/material";
import {
  People as PeopleIcon,
  MenuBook as MenuBookIcon,
  AccountBalanceWallet as AccountBalanceWalletIcon,
  Star as StarIcon,
} from "@mui/icons-material";
import StatCard from "@/ui/components/Instructor/StatCard";
import { InstructorDashboardWelcome } from "@/module/instructor/InstructorDashboardWelcome";
import { InstructorRecentCourses } from "@/module/instructor/InstructorRecentCourses";
import { InstructorRecentQA } from "@/module/instructor/InstructorRecentQA";
import { useInstructorDashboardStats } from "@/hooks/react-query/useInstructorCourses";

export default function InstructorDashboardPage() {
  const { data: stats, isLoading } = useInstructorDashboardStats();

  const totalStudents = stats?.totalStudents ?? 0;
  const activeCourses = stats?.activeCourses ?? 0;
  const underReview = stats?.underReviewCourses ?? 0;
  const totalCourses = stats?.totalCourses ?? 0;
  const totalEarnings = stats?.totalEarnings ?? 0;
  const avgRating = stats?.averageRating ?? 0;

  return (
    <Stack spacing={3} sx={{ width: "100%" }}>
      {/* 1. Welcome & Primary Action Banner */}
      <InstructorDashboardWelcome />

      {/* 2. Key Metrics Grid */}
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Total Students"
            value={isLoading ? "..." : totalStudents.toLocaleString()}
            change={totalStudents > 0 ? "Enrolled" : "No enrollments"}
            isPositive={totalStudents > 0}
            subtitle="Lifetime unique students"
            icon={<PeopleIcon sx={{ fontSize: "1.25rem" }} />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Active Courses"
            value={isLoading ? "..." : String(activeCourses)}
            change={`${totalCourses} total`}
            isPositive={activeCourses > 0}
            subtitle={`${activeCourses} live · ${underReview} in review`}
            icon={<MenuBookIcon sx={{ fontSize: "1.25rem" }} />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Instructor Earnings"
            value={
              isLoading
                ? "..."
                : `₹${totalEarnings.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`
            }
            change={totalEarnings > 0 ? "Earned" : "$0.00"}
            isPositive={totalEarnings > 0}
            subtitle="Total course revenue"
            icon={<AccountBalanceWalletIcon sx={{ fontSize: "1.25rem" }} />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Course Rating"
            value={isLoading ? "..." : avgRating > 0 ? avgRating.toFixed(1) : "New"}
            change={avgRating > 0 ? `${avgRating} ★` : "Unrated"}
            isPositive={avgRating >= 4.0}
            subtitle="Average across all courses"
            icon={<StarIcon sx={{ fontSize: "1.25rem" }} />}
          />
        </Grid>
      </Grid>

      {/* 3. Operational Sections: Recent Courses & Student Inquiries */}
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <InstructorRecentCourses />
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <InstructorRecentQA />
        </Grid>
      </Grid>
    </Stack>
  );
}
