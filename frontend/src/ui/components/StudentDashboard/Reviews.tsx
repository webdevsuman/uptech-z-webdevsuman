"use client";

import React from "react";
import Link from "next/link";
import {
  Box,
  Card,
  CardContent,
  Rating,
  Typography,
  Stack,
  CircularProgress,
  Button,
} from "@mui/material";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import { useMyReviews } from "@/hooks/react-query/useReviews";

export default function Reviews() {
  const { data: reviews = [], isLoading, isError } = useMyReviews();

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress size={40} sx={{ color: "#5624D0" }} />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ textAlign: "center", py: 6 }}>
        <Typography color="error" variant="body1">
          Failed to load your reviews. Please try again.
        </Typography>
      </Box>
    );
  }

  if (reviews.length === 0) {
    return (
      <Box
        sx={{
          textAlign: "center",
          py: 8,
          px: 4,
          borderRadius: 3,
          border: "1px dashed",
          borderColor: "grey.300",
          bgcolor: "grey.50",
          maxWidth: 600,
          mx: "auto",
        }}
      >
        <RateReviewOutlinedIcon sx={{ fontSize: 48, color: "text.secondary", mb: 1.5 }} />
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
          You have not reviewed any courses yet
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Enrolled in a course? Visit the course page to share your experience with other students!
        </Typography>
        <Link href="/student/dashboard" passHref style={{ textDecoration: "none" }}>
          <Button
            variant="contained"
            sx={{
              bgcolor: "#5624D0",
              fontWeight: 700,
              textTransform: "none",
              px: 3,
              "&:hover": { bgcolor: "#401b9c" },
            }}
          >
            View My Courses
          </Button>
        </Link>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
        gap: 3,
      }}
    >
      {reviews.map((r) => {
        const courseTitle = r.course?.title || "Enrolled Course";
        const formattedDate = new Date(r.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });

        return (
          <Card
            key={r._id}
            elevation={2}
            sx={{
              borderRadius: 3,
              p: 1,
              border: "1px solid",
              borderColor: "grey.200",
            }}
          >
            <CardContent>
              <Stack direction="column" spacing={1.5}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#1c1d1f" }}>
                    {courseTitle}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
                    {formattedDate}
                  </Typography>
                </Box>

                <Rating value={r.rating} readOnly size="small" precision={0.5} />

                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    fontStyle: "italic",
                    lineHeight: 1.6,
                    bgcolor: "grey.50",
                    p: 2,
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "grey.100",
                  }}
                >
                  &ldquo;{r.comment}&rdquo;
                </Typography>

                {r.course?._id && (
                  <Box sx={{ pt: 1 }}>
                    <Link
                      href={`/courses/${r.course._id}`}
                      passHref
                      style={{ textDecoration: "none" }}
                    >
                      <Button
                        size="small"
                        sx={{
                          fontWeight: 700,
                          textTransform: "none",
                          color: "#5624D0",
                          p: 0,
                          "&:hover": { textDecoration: "underline", bgcolor: "transparent" },
                        }}
                      >
                        View Course & Reviews →
                      </Button>
                    </Link>
                  </Box>
                )}
              </Stack>
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
}
