"use client";

import React, { useEffect, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
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
import {
  useCreateCheckoutSession,
  useVerifyPaymentSession,
} from "@/hooks/react-query/usePayment";
import CourseHeader from "@/ui/components/CourseDetails/CourseHeader";
import CourseSyllabus from "@/ui/components/CourseDetails/CourseSyllabus";
import CourseInstructor from "@/ui/components/CourseDetails/CourseInstructor";
import CourseCommunityTabs from "@/ui/components/CourseDetails/CourseCommunityTabs";
import CourseAnnouncements from "@/ui/components/CourseDetails/CourseAnnouncements";
import { ICourseInstructor } from "@/typescript/interface/course.interface";
import { sToast } from "@/components/ui/alert/stoast";

export default function CourseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = typeof params?.id === "string" ? params.id : "";
  const { user } = useAuth();
  const isAuthenticated = Boolean(user);

  const paymentStatus = searchParams?.get("payment");
  const sessionId = searchParams?.get("session_id");
  const verifiedSessionRef = useRef(false);

  const { data: course, isLoading, isError } = useCourse(id);
  const { data: enrollmentData } = useEnrollmentStatus(id, isAuthenticated);
  const { data: wishlistData } = useWishlistStatus(id, isAuthenticated);

  const { mutate: enrollCourse, isPending: isEnrolling } = useEnrollCourse(id);
  const { mutate: toggleWishlist, isPending: isTogglingWishlist } = useToggleWishlist(id);
  const { mutate: createCheckoutSession, isPending: isCreatingCheckout } = useCreateCheckoutSession();
  const { mutate: verifyPaymentSession, isPending: isVerifyingPayment } = useVerifyPaymentSession(id);

  // Handle Stripe return redirect (success or cancelled)
  useEffect(() => {
    if (paymentStatus === "success" && sessionId && !verifiedSessionRef.current) {
      verifiedSessionRef.current = true;
      verifyPaymentSession(
        { sessionId },
        {
          onSuccess: () => {
            sToast.success("Payment successful! You are now enrolled.");
            router.replace(`/courses/${id}`, { scroll: false });
          },
          onError: (err: unknown) => {
            const error = err as { response?: { data?: { message?: string } } };
            sToast.error(error.response?.data?.message || "Failed to confirm payment");
            router.replace(`/courses/${id}`, { scroll: false });
          },
        }
      );
    } else if (paymentStatus === "cancelled") {
      sToast.info("Checkout was cancelled. No charges were made.");
      router.replace(`/courses/${id}`, { scroll: false });
    }
  }, [paymentStatus, sessionId, id, verifyPaymentSession, router]);

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
    if (enrollmentData?.isEnrolled) {
      sToast.info("You are already enrolled in this course");
      return;
    }

    const price = typeof course?.price === "number" ? course.price : 0;

    // Free course: direct enrollment
    if (price <= 0) {
      enrollCourse(
        { courseId: id },
        {
          onSuccess: () => sToast.success("Successfully enrolled! Welcome to the course."),
          onError: (err: unknown) => {
            const error = err as { response?: { data?: { message?: string } } };
            sToast.error(error.response?.data?.message || "Failed to enroll in course");
          },
        }
      );
      return;
    }

    // Paid course: Stripe Checkout Session
    createCheckoutSession(
      { courseId: id },
      {
        onSuccess: (res) => {
          if (res.url) {
            window.location.href = res.url;
          } else if (res.isFree) {
            sToast.success("Successfully enrolled in course.");
          }
        },
        onError: (err: unknown) => {
          const error = err as { response?: { data?: { message?: string } } };
          sToast.error(error.response?.data?.message || "Failed to initiate payment");
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
        <Paper elevation={0} sx={{ p: 6, textAlign: "center", border: "1px solid", borderColor: "divider", borderRadius: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, color: "text.primary" }}>
            Course Not Found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4, maxWidth: 450, mx: "auto" }}>
            The course you are looking for may have been unpublished, moved, or does not exist.
          </Typography>
          <Link href="/" passHref style={{ textDecoration: "none" }}>
            <Button variant="contained" startIcon={<ArrowBackIcon />} sx={{ bgcolor: "#5624D0", fontWeight: 700, textTransform: "none", px: 3, py: 1 }}>
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

  const isBusyEnrolling = isEnrolling || isCreatingCheckout || isVerifyingPayment;

  return (
    <Box sx={{ pb: 8, bgcolor: "background.default", minHeight: "80vh" }}>
      <CourseHeader
        course={course}
        instructor={instructorData}
        wishlisted={Boolean(wishlistData?.isWishlisted)}
        enrolled={Boolean(enrollmentData?.isEnrolled)}
        isInstructor={Boolean(enrollmentData?.isInstructor)}
        isEnrolling={isBusyEnrolling}
        isTogglingWishlist={isTogglingWishlist}
        onToggleWishlist={handleToggleWishlist}
        onEnroll={handleEnroll}
      />
      <CourseSyllabus
        courseId={course._id || id}
        sections={course.sections}
        enrolled={Boolean(enrollmentData?.isEnrolled)}
        isInstructor={Boolean(enrollmentData?.isInstructor)}
      />
      <CourseInstructor instructor={instructorData} />
      <CourseAnnouncements
        courseId={course._id || id}
        instructorName={instructorData?.name}
      />
      <CourseCommunityTabs
        courseId={course._id || id}
        isEnrolled={Boolean(enrollmentData?.isEnrolled)}
        isInstructor={Boolean(enrollmentData?.isInstructor)}
        onEnroll={handleEnroll}
      />
    </Box>
  );
}
