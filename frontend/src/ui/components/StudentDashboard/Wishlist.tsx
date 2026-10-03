"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Tooltip,
  Button,
  CircularProgress,
  Stack,
  Rating,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useMyWishlist, useToggleWishlist } from "@/hooks/react-query/useWishlist";
import { useEnrollCourse } from "@/hooks/react-query/useEnrollment";
import { getImageUrl } from "@/utils/getImageUrl";
import { sToast } from "@/components/ui/alert/stoast";

export default function Wishlist() {
  const { data: wishlist = [], isLoading, isError } = useMyWishlist();
  const [enrollingCourseId, setEnrollingCourseId] = useState<string | null>(null);

  const { mutate: toggleWishlist, isPending: isRemoving } = useToggleWishlist("");
  const { mutate: enrollCourse } = useEnrollCourse("");

  const handleRemove = (courseId: string) => {
    toggleWishlist(
      { courseId },
      {
        onSuccess: () => {
          sToast.info("Removed from wishlist");
        },
        onError: (err: unknown) => {
          const error = err as { response?: { data?: { message?: string } } };
          sToast.error(error.response?.data?.message || "Failed to remove course");
        },
      }
    );
  };

  const handleEnroll = (courseId: string) => {
    setEnrollingCourseId(courseId);
    enrollCourse(
      { courseId },
      {
        onSuccess: () => {
          sToast.success("Successfully enrolled in course!");
          setEnrollingCourseId(null);
        },
        onError: (err: unknown) => {
          const error = err as { response?: { data?: { message?: string } } };
          sToast.error(error.response?.data?.message || "Failed to enroll in course");
          setEnrollingCourseId(null);
        },
      }
    );
    toggleWishlist({courseId});
  };


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
          Failed to load wishlist items. Please try again.
        </Typography>
      </Box>
    );
  }

  if (wishlist.length === 0) {
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
        <FavoriteBorderIcon sx={{ fontSize: 48, color: "text.secondary", mb: 1.5 }} />
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
          Your wishlist is empty
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Explore courses and click the heart icon to save courses for later!
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
            Explore Courses
          </Button>
        </Link>
      </Box>
    );
  }

  return (
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
      {wishlist.map((item) => {
        const course = item.course;
        if (!course) return null;
        const thumbnailSrc = getImageUrl(course.thumbnail);
        const instructorName =
          typeof course.instructor === "object" && course.instructor !== null
            ? course.instructor.name
            : "Instructor";

        const isCurrentEnrolling = enrollingCourseId === course._id;

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
            <Box>
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
                    mb: 0.5,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {course.title}
                </Typography>

                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
                  {instructorName}
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

                <Typography variant="h6" sx={{ fontWeight: 800, color: "#1c1d1f" }}>
                  {course.price && course.price > 0 ? `₹${course.price}` : "Free"}
                </Typography>
              </CardContent>
            </Box>

            <Box sx={{ p: 2, pt: 0, display: "flex", alignItems: "center", gap: 1 }}>
              <Button
                fullWidth
                variant="contained"
                startIcon={
                  isCurrentEnrolling ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : (
                    <ShoppingCartIcon />
                  )
                }
                onClick={() => handleEnroll(course._id)}
                disabled={isCurrentEnrolling}
                sx={{
                  bgcolor: "#5624D0",
                  fontWeight: 700,
                  textTransform: "none",
                  borderRadius: 2,
                  "&:hover": { bgcolor: "#401b9c" },
                }}
              >
                {isCurrentEnrolling ? "Enrolling..." : "Enroll Now"}
              </Button>

              <Tooltip title="Remove from Wishlist">
                <IconButton
                  color="error"
                  disabled={isRemoving}
                  onClick={() => handleRemove(course._id)}
                  sx={{ border: "1px solid", borderColor: "divider" }}
                >
                  <FavoriteIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Card>
        );
      })}
    </Box>
  );
}
