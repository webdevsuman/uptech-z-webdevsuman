"use client";

import React from "react";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  Alert,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useAuth } from "@/context/AuthContext";
import {
  useCourseReviews,
  useReviewEligibility,
  useCreateOrUpdateReview,
} from "@/hooks/react-query/useReviews";
import ReviewStatsSummary from "./components/ReviewStatsSummary";
import ReviewItem from "./components/ReviewItem";
import ReviewForm from "./components/ReviewForm";
import { sToast } from "@/components/ui/alert/stoast";

interface CourseReviewsProps {
  courseId: string;
  embedded?: boolean;
}

export default function CourseReviews({ courseId, embedded = false }: CourseReviewsProps) {
  const { user } = useAuth();
  const isAuthenticated = Boolean(user);

  const { data: reviewsData, isLoading: isLoadingReviews } = useCourseReviews(courseId);
  const { data: eligibility, isLoading: isLoadingEligibility } = useReviewEligibility(
    courseId,
    isAuthenticated
  );

  const { mutate: submitReview, isPending: isSubmitting } = useCreateOrUpdateReview(courseId);

  const handleReviewSubmit = (payload: {
    courseId: string;
    rating: number;
    comment: string;
  }) => {
    submitReview(payload, {
      onSuccess: () => {
        sToast.success("Your review has been submitted successfully!");
      },
      onError: (err: unknown) => {
        const error = err as { response?: { data?: { message?: string } } };
        sToast.error(error.response?.data?.message || "Failed to submit review");
      },
    });
  };

  const reviews = reviewsData?.reviews || [];
  const stats = reviewsData?.stats || {
    avgRating: 0,
    totalReviews: 0,
    distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    distributionPercentages: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  };

  const reviewBody = (
    <>
      {!embedded && (
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, color: "#1c1d1f" }}>
          Student Feedback & Reviews
        </Typography>
      )}

          {/* Rating Summary Header with Distribution Bars */}
          {isLoadingReviews ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress size={36} sx={{ color: "#5624D0" }} />
            </Box>
          ) : (
            <ReviewStatsSummary stats={stats} />
          )}

          {/* Conditional Review Form or Permission Notice */}
          {!isAuthenticated ? (
            <Alert
              severity="info"
              icon={<LockOutlinedIcon fontSize="inherit" />}
              sx={{ mb: 4, borderRadius: 2 }}
            >
              Please log in with an enrolled student account to rate and review this course.
            </Alert>
          ) : isLoadingEligibility ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, py: 2, mb: 2 }}>
              <CircularProgress size={20} />
              <Typography variant="body2" color="text.secondary">
                Checking review permissions...
              </Typography>
            </Box>
          ) : eligibility?.isInstructor ? (
            <Alert
              severity="warning"
              icon={<InfoOutlinedIcon fontSize="inherit" />}
              sx={{ mb: 4, borderRadius: 2 }}
            >
              You are the instructor of this course. Instructors cannot rate or review their own courses.
            </Alert>
          ) : !eligibility?.isEnrolled ? (
            <Alert
              severity="info"
              icon={<SchoolOutlinedIcon fontSize="inherit" />}
              sx={{ mb: 4, borderRadius: 2 }}
            >
              Only students who have purchased and enrolled in this course can leave a review.
            </Alert>
          ) : (
            <ReviewForm
              courseId={courseId}
              existingReview={eligibility.existingReview}
              isSubmitting={isSubmitting}
              onSubmit={handleReviewSubmit}
            />
          )}

          {/* Review List */}
          {reviews.length === 0 ? (
            <Box
              sx={{
                p: 4,
                textAlign: "center",
                borderRadius: 2,
                border: "1px dashed",
                borderColor: "grey.300",
                bgcolor: "grey.50",
              }}
            >
              <Typography variant="body1" sx={{ fontWeight: 600, color: "text.primary" }}>
                No reviews yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Enrolled students can be the first to rate and share their experience!
              </Typography>
            </Box>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map((r) => (
                <ReviewItem key={r._id} review={r} />
              ))}
            </div>
          )}
    </>
  );

  if (embedded) {
    return <Box sx={{ mt: 1 }}>{reviewBody}</Box>;
  }

  return (
    <div className="md:px-24 px-5 max-w-7xl mx-auto my-8">
      <Card
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
          p: 3,
        }}
      >
        <CardContent sx={{ p: 0 }}>{reviewBody}</CardContent>
      </Card>
    </div>
  );
}
