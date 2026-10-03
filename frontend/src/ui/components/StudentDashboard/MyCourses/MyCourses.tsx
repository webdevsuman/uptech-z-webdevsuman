"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Rating,
  Stack,
  Dialog,
} from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutlined";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { useMyEnrollments } from "@/hooks/react-query/useEnrollment";
import { getImageUrl } from "@/utils/getImageUrl";
import CoursePlayer from "./Player/CoursePlayer";

export default function MyCourses() {
  const { data: enrollments = [], isLoading, isError } = useMyEnrollments();
  const [watchingCourseId, setWatchingCourseId] = useState<string | null>(null);

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
          Failed to load your enrolled courses. Please try again.
        </Typography>
      </Box>
    );
  }

  if (enrollments.length === 0) {
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
        <MenuBookIcon sx={{ fontSize: 48, color: "text.secondary", mb: 1.5 }} />
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
          You haven&apos;t enrolled in any courses yet
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Explore our wide range of topics and start learning today!
        </Typography>
        <Link href="/" passHref style={{ textDecoration: "none" }}>
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
            Browse Courses
          </Button>
        </Link>
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
          gap: 3,
        }}
      >
        {enrollments.map((item) => {
          const course = item.course;
          if (!course) return null;
          const thumbnailSrc = getImageUrl(course.thumbnail);
          const enrolledDate = new Date(item.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });

          return (
            <Card
              key={item._id}
              elevation={2}
              sx={{
                borderRadius: 3,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 6,
                },
              }}
            >
              <Box
                onClick={() => setWatchingCourseId(course._id)}
                sx={{ cursor: "pointer" }}
              >
                <CardMedia
                  component="img"
                  height="150"
                  image={thumbnailSrc}
                  alt={course.title}
                  sx={{ objectFit: "cover" }}
                />
                <CardContent sx={{ pb: 1 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 700,
                      lineHeight: 1.3,
                      mb: 1,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {course.title}
                  </Typography>

                  <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 1 }}>
                    <Rating
                      value={course.rating || 0}
                      precision={0.1}
                      readOnly
                      size="small"
                    />
                    <Typography variant="caption" color="text.secondary">
                      ({course.reviewsCount || 0})
                    </Typography>
                  </Stack>

                  <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                    Enrolled on {enrolledDate}
                  </Typography>
                </CardContent>
              </Box>

              <Box sx={{ p: 2, pt: 0, display: "flex", flexDirection: "column", gap: 1 }}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<PlayCircleOutlineIcon />}
                  onClick={() => setWatchingCourseId(course._id)}
                  sx={{
                    bgcolor: "#5624D0",
                    fontWeight: 700,
                    textTransform: "none",
                    borderRadius: 2,
                    "&:hover": { bgcolor: "#401b9c" },
                  }}
                >
                  Watch Course
                </Button>

                <Link
                  href={`/courses/${course._id}`}
                  passHref
                  style={{ textDecoration: "none" }}
                >
                  <Button
                    fullWidth
                    size="small"
                    variant="text"
                    endIcon={<OpenInNewIcon sx={{ fontSize: "14px !important" }} />}
                    sx={{
                      color: "text.secondary",
                      textTransform: "none",
                      fontSize: "0.8rem",
                      py: 0.5,
                      "&:hover": { color: "#5624D0", bgcolor: "transparent" },
                    }}
                  >
                    View Course Details & Reviews
                  </Button>
                </Link>
              </Box>
            </Card>
          );
        })}
      </Box>

      {/* Course Video Player Modal */}
      {watchingCourseId && (
        <Dialog
          open={Boolean(watchingCourseId)}
          onClose={() => setWatchingCourseId(null)}
          maxWidth="lg"
          fullWidth
          slotProps={{
            paper: {
              sx: { bgcolor: "#0f1117", borderRadius: 3, overflow: "hidden" },
            },
          }}
        >
          <CoursePlayer
            courseId={watchingCourseId}
            onClose={() => setWatchingCourseId(null)}
          />
        </Dialog>
      )}
    </Box>
  );
}
