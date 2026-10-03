"use client";

import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Rating,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { reviewFormSchema, ReviewFormData } from "../zod/review.zod";
import { IReview } from "@/typescript/interface/review.interface";

interface ReviewFormProps {
  courseId: string;
  existingReview: IReview | null;
  isSubmitting: boolean;
  onSubmit: (data: { courseId: string; rating: number; comment: string }) => void;
}

export default function ReviewForm({
  courseId,
  existingReview,
  isSubmitting,
  onSubmit,
}: ReviewFormProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      rating: existingReview?.rating ?? 5,
      comment: existingReview?.comment ?? "",
    },
  });

  useEffect(() => {
    if (existingReview) {
      reset({
        rating: existingReview.rating,
        comment: existingReview.comment,
      });
    }
  }, [existingReview, reset]);

  const onValidSubmit = (data: ReviewFormData) => {
    onSubmit({
      courseId,
      rating: data.rating,
      comment: data.comment.trim(),
    });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onValidSubmit)}
      sx={{
        p: 3,
        mb: 4,
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "#fdfcff",
      }}
    >
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5, color: "#1c1d1f" }}>
        {existingReview ? "Edit Your Review" : "Leave a Rating & Review"}
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, color: "text.secondary" }}>
          Select Star Rating:
        </Typography>
        <Controller
          name="rating"
          control={control}
          render={({ field }) => (
            <Rating
              name="course-review-rating"
              value={field.value}
              precision={1}
              onChange={(_, val) => {
                if (val !== null) {
                  field.onChange(val);
                }
              }}
              emptyIcon={<StarIcon style={{ opacity: 0.35 }} fontSize="inherit" />}
              size="large"
            />
          )}
        />
        {errors.rating && (
          <Typography variant="caption" color="error" sx={{ display: "block", mt: 0.5 }}>
            {errors.rating.message}
          </Typography>
        )}
      </Box>

      <TextField
        fullWidth
        multiline
        rows={3}
        size="small"
        placeholder="Share your detailed feedback on course content, instructor clarity, and key takeaways..."
        {...register("comment")}
        error={Boolean(errors.comment)}
        helperText={errors.comment?.message}
        sx={{ mb: 2 }}
      />

      <Button
        type="submit"
        variant="contained"
        disabled={isSubmitting}
        startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : null}
        sx={{
          fontWeight: 700,
          textTransform: "none",
          bgcolor: "#5624D0",
          px: 3,
          "&:hover": { bgcolor: "#401b9c" },
        }}
      >
        {isSubmitting
          ? "Submitting..."
          : existingReview
          ? "Update Review"
          : "Submit Review"}
      </Button>
    </Box>
  );
}
