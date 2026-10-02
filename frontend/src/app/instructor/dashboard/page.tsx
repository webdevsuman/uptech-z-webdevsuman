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

export default function InstructorDashboardPage() {
  return (
    <Stack spacing={3} sx={{ width: "100%" }}>
      {/* 1. Welcome & Primary Action Banner */}
      <InstructorDashboardWelcome />

      {/* 2. Key Metrics Grid */}
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Total Students"
            value="1,181"
            change="14.5%"
            isPositive={true}
            subtitle="Lifetime enrollments"
            icon={<PeopleIcon sx={{ fontSize: "1.25rem" }} />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Active Courses"
            value="4"
            change="1 new"
            isPositive={true}
            subtitle="3 live · 1 under review"
            icon={<MenuBookIcon sx={{ fontSize: "1.25rem" }} />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Instructor Earnings"
            value="$4,850.00"
            change="18.2%"
            isPositive={true}
            subtitle="Net payout this month"
            icon={<AccountBalanceWalletIcon sx={{ fontSize: "1.25rem" }} />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Course Rating"
            value="4.8"
            change="98%"
            isPositive={true}
            subtitle="Average across 420 reviews"
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
