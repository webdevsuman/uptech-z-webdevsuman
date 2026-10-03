"use client";

import React, { useState } from "react";
import { Box, Tabs, Tab, Typography, Paper } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import PersonOutlineIcon from "@mui/icons-material/PersonOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import MyCourses from "@/ui/components/StudentDashboard/MyCourses/MyCourses";
import Profile from "@/ui/components/StudentDashboard/Profile";
import Wishlist from "@/ui/components/StudentDashboard/Wishlist";
import Certificates from "@/ui/components/StudentDashboard/Certificates";
import Reviews from "@/ui/components/StudentDashboard/Reviews";
import ProtectedRoute from "@/ui/components/Auth/ProtectedRoute";

export default function StudentDashboard() {
  const [tab, setTab] = useState(0);

  return (
    <ProtectedRoute allowedRoles={["student", "instructor", "admin"]}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 800, color: "#1c1d1f", mb: 0.5 }}
          >
            Student Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your enrolled courses, learning profile, wishlist, and certificates
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            mb: 4,
            bgcolor: "transparent",
          }}
        >
          <Tabs
            value={tab}
            onChange={(_, val) => setTab(val)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              "& .MuiTab-root": {
                fontWeight: 700,
                textTransform: "none",
                fontSize: "0.95rem",
                minHeight: 48,
                color: "text.secondary",
                "&.Mui-selected": {
                  color: "#5624D0",
                },
              },
              "& .MuiTabs-indicator": {
                bgcolor: "#5624D0",
                height: 3,
                borderRadius: "3px 3px 0 0",
              },
            }}
          >
            <Tab icon={<SchoolIcon fontSize="small" />} iconPosition="start" label="My Courses" />
            <Tab icon={<PersonOutlineIcon fontSize="small" />} iconPosition="start" label="Profile" />
            <Tab icon={<FavoriteBorderIcon fontSize="small" />} iconPosition="start" label="Wishlist" />
            <Tab icon={<WorkspacePremiumIcon fontSize="small" />} iconPosition="start" label="Certificates" />
            <Tab icon={<RateReviewOutlinedIcon fontSize="small" />} iconPosition="start" label="Reviews" />
          </Tabs>
        </Paper>

        <Box sx={{ minHeight: "50vh" }}>
          {tab === 0 && <MyCourses />}
          {tab === 1 && <Profile />}
          {tab === 2 && <Wishlist />}
          {tab === 3 && <Certificates />}
          {tab === 4 && <Reviews />}
        </Box>
      </div>
    </ProtectedRoute>
  );
}
