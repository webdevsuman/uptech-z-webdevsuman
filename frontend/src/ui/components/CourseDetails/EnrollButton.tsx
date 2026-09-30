"use client";

import { Button, CircularProgress } from "@mui/material";
import {
  useEnrollCourse,
  useEnrollmentStatus,
} from "@/hooks/react-query/useEnrollment";

export default function EnrollButton({
  courseId,
  userId,
  isPaid,
}: {
  courseId: string;
  userId: string; // 🔹 from auth context
  isPaid?: boolean;
}) {
  const { data: enrolled, isLoading: loadingStatus } = useEnrollmentStatus(
    courseId,
    userId
  );
  const enrollCourse = useEnrollCourse();

  const handleEnroll = async () => {
    if (isPaid) {
      // 🔹 later integrate Razorpay/Stripe
      alert("Redirecting to payment gateway...");
    } else {
      await enrollCourse.mutateAsync({ course_id: courseId, user_id: userId });
    }
  };

  if (loadingStatus) return <CircularProgress size={20} />;

  return (
    <Button
      variant="contained"
      color={enrolled ? "success" : "primary"}
      onClick={handleEnroll}
      disabled={enrolled}
    >
      {enrolled ? "Go to Course" : isPaid ? "Buy Now" : "Enroll for Free"}
    </Button>
  );
}
