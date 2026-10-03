"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Container,
  Box,
  CircularProgress,
  Typography,
  Button,
  Paper,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useAuth } from "@/context/AuthContext";
import { useCourse } from "@/hooks/react-query/useCourse";
import {
  useEnrollmentStatus,
  useEnrollCourse,
} from "@/hooks/react-query/useEnrollment";
import {
  useWishlistStatus,
  useToggleWishlist,
} from "@/hooks/react-query/useWishlist";
import CourseHeader from "@/ui/components/CourseDetails/CourseHeader";
import CourseSyllabus from "@/ui/components/CourseDetails/CourseSyllabus";
import CourseInstructor from "@/ui/components/CourseDetails/CourseInstructor";
import CourseReviews from "@/ui/components/CourseDetails/CourseReviews";
import { ICourseInstructor } from "@/typescript/interface/course.interface";
import { sToast } from "@/components/ui/alert/stoast";

export default function CourseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params?.id === "string" ? params.id : "";
  const { user } = useAuth();
  const isAuthenticated = Boolean(user);

  const { data: course, isLoading, isError } = useCourse(id);
  const { data: enrollmentData } = useEnrollmentStatus(id, isAuthenticated);
  const { data: wishlistData } = useWishlistStatus(id, isAuthenticated);

  const { mutate: enrollCourse, isPending: isEnrolling } = useEnrollCourse(id);
  const { mutate: toggleWishlist, isPending: isTogglingWishlist } = useToggleWishlist(id);

  const handleToggleWishlist = () => {
    if (!isAuthenticated) {
      sToast.error("Please log in to add courses to your wishlist");
      router.push("/login");
      return;
    }
    toggleWishlist(
      { courseId: id },
      {
        onSuccess: (res) => {
          if (res.data?.isWishlisted) {
            sToast.success("Added course to wishlist!");
          } else {
            sToast.info("Removed course from wishlist");
          }
        },
        onError: (err: unknown) => {
          const error = err as { response?: { data?: { message?: string } } };
          sToast.error(error.response?.data?.message || "Failed to update wishlist");
        },
      }
    );
  };

  const handleEnroll = () => {
    if (!isAuthenticated) {
      sToast.error("Please log in to enroll in this course");
      router.push("/login");
      return;
    }
    if (enrollmentData?.isInstructor) {
      sToast.error("Instructors cannot enroll in their own course");
      return;
    }
    enrollCourse(
      { courseId: id },
      {
        onSuccess: () => {
          sToast.success("Successfully enrolled! Welcome to the course.");
        },
        onError: (err: unknown) => {
          const error = err as { response?: { data?: { message?: string } } };
          sToast.error(error.response?.data?.message || "Failed to enroll in course");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 14, display: "flex", justifyContent: "center" }}>
        <CircularProgress size={48} sx={{ color: "#5624D0" }} />
      </Container>
    );
  }

  if (isError || !course) {
    return (
      <Container maxWidth="md" sx={{ py: 12 }}>
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: "center",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 3,
            bgcolor: "background.paper",
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, color: "text.primary" }}>
            Course Not Found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4, maxWidth: 450, mx: "auto" }}>
            The course you are looking for may have been unpublished, moved, or does not exist.
          </Typography>
          <Link href="/" passHref style={{ textDecoration: "none" }}>
            <Button
              variant="contained"
              startIcon={<ArrowBackIcon />}
              sx={{ bgcolor: "#5624D0", fontWeight: 700, textTransform: "none", px: 3, py: 1 }}
            >
              Browse All Courses
            </Button>
          </Link>
        </Paper>
      </Container>
    );
  }

  const instructorData: ICourseInstructor | null =
    typeof course.instructor === "object" && course.instructor !== null
      ? (course.instructor as ICourseInstructor)
      : null;

  return (
    <Box sx={{ pb: 8, bgcolor: "background.default", minHeight: "80vh" }}>
      {/* Hero Header with Course Overview & Pricing Card */}
      <CourseHeader
        course={course}
        instructor={instructorData}
        wishlisted={Boolean(wishlistData?.isWishlisted)}
        enrolled={Boolean(enrollmentData?.isEnrolled)}
        isInstructor={Boolean(enrollmentData?.isInstructor)}
        isEnrolling={isEnrolling}
        isTogglingWishlist={isTogglingWishlist}
        onToggleWishlist={handleToggleWishlist}
        onEnroll={handleEnroll}
      />

      {/* Course Curriculum & Syllabus */}
      <CourseSyllabus
        courseId={course._id || id}
        sections={course.sections}
        enrolled={Boolean(enrollmentData?.isEnrolled)}
        isInstructor={Boolean(enrollmentData?.isInstructor)}
      />

      {/* Instructor Profile Card */}
      <CourseInstructor instructor={instructorData} />

      {/* Student Reviews & Feedback */}
      <CourseReviews courseId={course._id || id} />
    </Box>
  );
}
