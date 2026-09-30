import type { Metadata } from "next";
import React from "react";
import { DashboardHeader } from "@/module/dashboard/DashboardHeader";
import { LmsMetrics } from "@/module/dashboard/LmsMetrics";

export const metadata: Metadata = {
  title: "Admin Dashboard | UpTech-Z LMS",
  description: "UpTech-Z Learning Management System Administrator Dashboard",
};

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <DashboardHeader />
      <LmsMetrics />
    </div>
  );
}

