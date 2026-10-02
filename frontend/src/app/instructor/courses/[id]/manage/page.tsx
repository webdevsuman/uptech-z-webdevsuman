"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Container,
  Box,
  CircularProgress,
  Typography,
  Button,
  Grid,
  Paper,
} from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import Link from "next/link";
import { useCourse } from "@/hooks/react-query/useCourse";
import { CourseManageHeader } from "@/module/instructor/course-manage/components/CourseManageHeader";
import {
  CourseManageSidebar,
  ManageTab,
} from "@/module/instructor/course-manage/components/CourseManageSidebar";
import { CourseLandingPageForm } from "@/module/instructor/course-manage/components/CourseLandingPageForm";
import { CurriculumManager } from "@/module/instructor/course-manage/components/curriculum/CurriculumManager";
import { CoursePricingForm } from "@/module/instructor/course-manage/components/CoursePricingForm";
import { CoursePublishForm } from "@/module/instructor/course-manage/components/CoursePublishForm";

export default function CourseManageStudioPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params?.id === "string" ? params.id : "";

  const { data: course, isLoading, isError, refetch } = useCourse(id);
  const [activeTab, setActiveTab] = useState<ManageTab>("landing-page");

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (isError || !course) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Paper elevation={0} sx={{ p: 4, textAlign: "center", border: "1px solid", borderColor: "divider" }}>
          <Typography variant="h6" color="error" gutterBottom>
            Course Not Found or Access Denied
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
            The requested course could not be loaded or you do not have permission to manage it.
          </Typography>
          <Button
            component={Link}
            href="/instructor/courses"
            variant="contained"
            color="primary"
            startIcon={<ArrowBackIcon />}
          >
            Back to My Courses
          </Button>
        </Paper>
      </Container>
    );
  }

  const isLandingComplete = Boolean(
    course.title &&
    course.description &&
    course.category &&
    course.thumbnail
  );

  const isCurriculumComplete = Boolean(
    course.sections &&
      course.sections.length > 0 &&
      course.sections.some((s) => s.lectures && s.lectures.length > 0)
  );

  const isPricingComplete =
    typeof course.price === "number" && !isNaN(course.price);

  const isPublishComplete = course.status !== "draft";

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 3 } }}>
      {/* Studio Header */}
      <CourseManageHeader
        course={course}
        isSaving={false}
        onSave={() => {}}
      />

      {/* Main Studio Body: Sidebar Navigation + Tab Content */}
      <Grid container spacing={3}>
        {/* Left: Step Navigation Sidebar */}
        <Grid size={{ xs: 12, md: 3 }}>
          <CourseManageSidebar
            activeTab={activeTab}
            onTabChange={(tab) => setActiveTab(tab)}
            isLandingComplete={isLandingComplete}
            isCurriculumComplete={isCurriculumComplete}
            isPricingComplete={isPricingComplete}
            isPublishComplete={isPublishComplete}
          />
        </Grid>

        {/* Right: Step Content */}
        <Grid size={{ xs: 12, md: 9 }}>
          {activeTab === "landing-page" && (
            <CourseLandingPageForm
              course={course}
              onSaved={() => refetch()}
              onProceedToCurriculum={() => setActiveTab("curriculum")}
              onProceedToPricing={() => setActiveTab("pricing")}
            />
          )}

          {activeTab === "curriculum" && (
            <CurriculumManager
              course={course}
              onProceedToPricing={() => setActiveTab("pricing")}
            />
          )}

          {activeTab === "pricing" && (
            <CoursePricingForm
              course={course}
              onSaved={() => refetch()}
              onProceedToPublish={() => setActiveTab("publish")}
            />
          )}

          {activeTab === "publish" && (
            <CoursePublishForm
              course={course}
              onSaved={() => refetch()}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
