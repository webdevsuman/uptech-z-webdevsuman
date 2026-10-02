"use client";

import React from "react";
import { Container, Box, Typography, Breadcrumbs } from "@mui/material";
import Link from "next/link";
import { CourseCreateWizard } from "@/module/instructor/course-create/components/CourseCreateWizard";

export default function CourseCreatePage() {
  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, md: 3 } }}>
      {/* Header & Breadcrumb */}
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 1, fontSize: "0.85rem" }}>
          <Link href="/instructor/dashboard" className="hover:underline text-gray-500">
            Instructor Studio
          </Link>
          <Link href="/instructor/courses" className="hover:underline text-gray-500">
            Courses
          </Link>
          <Typography color="text.primary" sx={{ fontSize: "0.85rem", fontWeight: 600 }}>
            Create Course
          </Typography>
        </Breadcrumbs>
        <Typography variant="h5" sx={{ fontWeight: 700, color: "text.primary" }}>
          Course Creation
        </Typography>
      </Box>

      {/* Multi-Step Creation Wizard */}
      <CourseCreateWizard />
    </Container>
  );
}
