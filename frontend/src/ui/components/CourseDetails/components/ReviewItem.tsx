"use client";

import React from "react";
import { Avatar, Rating, Stack, Typography, Box } from "@mui/material";
import { IReview } from "@/typescript/interface/review.interface";
import { getImageUrl } from "@/utils/getImageUrl";

interface ReviewItemProps {
  review: IReview;
}

export default function ReviewItem({ review }: ReviewItemProps) {
  const studentName = review.student?.name || "Student";
  const avatarUrl = review.student?.profilePicture
    ? getImageUrl(review.student.profilePicture)
    : undefined;
  const initial = studentName.charAt(0).toUpperCase();

  const formattedDate = new Date(review.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 2,
        border: "1px solid",
        borderColor: "grey.100",
        bgcolor: "grey.50",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Box>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 1.5 }}>
          <Avatar
            src={avatarUrl}
            sx={{
              width: 40,
              height: 40,
              bgcolor: "#5624D0",
              fontSize: "1rem",
              fontWeight: 700,
            }}
          >
            {initial}
          </Avatar>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              {studentName}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <Rating value={review.rating} readOnly size="small" precision={0.5} />
              <Typography variant="caption" color="text.secondary">
                {formattedDate}
              </Typography>
            </Stack>
          </Box>
        </Stack>
        <Typography variant="body2" color="text.primary" sx={{ lineHeight: 1.6 }}>
          {review.comment}
        </Typography>
      </Box>
    </Box>
  );
}
