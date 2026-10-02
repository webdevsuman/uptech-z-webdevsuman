"use client";

import React, { useState } from "react";
import { Box } from "@mui/material";
import ProtectedRoute from "@/ui/components/Auth/ProtectedRoute";
import InstructorSidebar from "@/ui/components/Instructor/InstructorSidebar";
import InstructorHeader from "@/ui/components/Instructor/InstructorHeader";

export default function InstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <ProtectedRoute allowedRoles={["instructor", "super-admin", "admin"]}>
      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
        {/* Left Sidebar Drawer */}
        <InstructorSidebar
          mobileOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
        />

        {/* Right Content Area */}
        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          <InstructorHeader
            onToggleMobileMenu={() => setMobileOpen((prev) => !prev)}
          />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: { xs: 2, sm: 3, md: 4 },
              overflowY: "auto",
            }}
          >
            <Box sx={{ maxWidth: 1200, mx: "auto" }}>{children}</Box>
          </Box>
        </Box>
      </Box>
    </ProtectedRoute>
  );
}
