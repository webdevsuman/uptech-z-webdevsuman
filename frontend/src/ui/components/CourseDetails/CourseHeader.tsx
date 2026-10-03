"use client";

import React from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  CardMedia,
  Chip,
  Rating,
  CircularProgress,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { ICourse, ICourseInstructor } from "@/typescript/interface/course.interface";
import { getImageUrl } from "@/utils/getImageUrl";

interface CourseHeaderProps {
  course: ICourse;
  photo_url?: string;
  instructor?: ICourseInstructor | null;
  wishlisted?: boolean;
  enrolled?: boolean;
  isInstructor?: boolean;
  isEnrolling?: boolean;
  isTogglingWishlist?: boolean;
  onToggleWishlist?: () => void;
  onEnroll?: () => void;
}

export default function CourseHeader({
  course,
  photo_url,
  instructor,
  wishlisted = false,
  enrolled = false,
  isInstructor = false,
  isEnrolling = false,
  isTogglingWishlist = false,
  onToggleWishlist,
  onEnroll,
}: CourseHeaderProps) {
  const instructorName =
    instructor?.name ||
    (typeof course.instructor === "object" && course.instructor !== null
      ? course.instructor.name
      : "Course Instructor");

  const categoryName =
    typeof course.category === "object" && course.category !== null
      ? course.category.name
      : "General";

  const thumbnailSrc = getImageUrl(course.thumbnail || photo_url);
  const ratingValue = Number(course.rating || 0);
  const reviewsCount = Number(course.reviewsCount || 0);

  return (
    <Box>
      <div className="bg-blend-darken bg-[#191a25] text-gray-200 py-10 md:px-24 px-5 flex flex-col md:grid grid-cols-5 gap-10 mt-3">
        {/* Left Column: Course Metadata */}
        <div className="flex flex-col gap-4 col-span-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Chip
              label={categoryName}
              size="small"
              sx={{ bgcolor: "#5624D0", color: "#fff", fontWeight: 700 }}
            />
            {course.level && (
              <Chip
                label={course.level.toUpperCase().replace("_", " ")}
                size="small"
                variant="outlined"
                sx={{ borderColor: "rgba(255,255,255,0.4)", color: "#fff" }}
              />
            )}
            {course.language && (
              <Chip
                label={course.language}
                size="small"
                variant="outlined"
                sx={{ borderColor: "rgba(255,255,255,0.4)", color: "#fff" }}
              />
            )}
          </div>

          <Typography variant="h4" sx={{ fontWeight: "bold", color: "#fff" }}>
            {course.title}
          </Typography>

          {course.subtitle && (
            <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.85)" }}>
              {course.subtitle}
            </Typography>
          )}

          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
            Created by <span className="underline text-[#a435f0] font-semibold">{instructorName}</span>
          </Typography>

          {/* Rating & Reviews live data */}
          <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap" }}>
            <Typography sx={{ color: "#f3ca8c", fontWeight: "bold" }}>
              {ratingValue > 0 ? ratingValue.toFixed(1) : "New"}
            </Typography>
            <Rating value={ratingValue} precision={0.1} readOnly size="small" />
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)" }}>
              ({reviewsCount} {reviewsCount === 1 ? "rating" : "ratings"})
            </Typography>
          </Stack>
        </div>

        {/* Right Column: Course Card / Enrollment Card */}
        <div className="col-span-2 bg-white text-gray-900 rounded-xl overflow-hidden shadow-2xl flex flex-col gap-5 p-6 border border-gray-200">
          <CardMedia
            component="img"
            sx={{ height: 210, width: "100%", borderRadius: 2 }}
            image={thumbnailSrc}
            alt={course.title}
          />

          {/* Price Display */}
          <div className="flex items-baseline gap-3">
            <Typography variant="h4" sx={{ fontWeight: "bold", color: "#1c1d1f" }}>
              {course.price && course.price > 0 ? `₹${course.price}` : "Free"}
            </Typography>
            {course.price && course.price > 0 && (
              <Typography
                variant="body2"
                sx={{ textDecoration: "line-through", color: "text.secondary" }}
              >
                ₹{course.price * 2}
              </Typography>
            )}
          </div>

          {/* Action Buttons */}
          <Stack direction="column" spacing={2}>
            {isInstructor ? (
              <Button
                variant="outlined"
                size="large"
                disabled
                sx={{ fontWeight: 700, py: 1.5, borderRadius: 2 }}
              >
                Instructor of this Course
              </Button>
            ) : enrolled ? (
              <Button
                color="success"
                variant="contained"
                size="large"
                disabled
                startIcon={<CheckCircleIcon />}
                sx={{ fontWeight: 700, py: 1.5, borderRadius: 2, bgcolor: "#107c41" }}
              >
                Enrolled
              </Button>
            ) : (
              <Button
                color="primary"
                variant="contained"
                size="large"
                startIcon={
                  isEnrolling ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <ShoppingCartIcon />
                  )
                }
                onClick={onEnroll}
                disabled={isEnrolling}
                sx={{
                  fontWeight: 700,
                  py: 1.5,
                  borderRadius: 2,
                  bgcolor: "#a435f0",
                  "&:hover": { bgcolor: "#8710d8" },
                }}
              >
                {isEnrolling
                  ? "Processing..."
                  : course.price && course.price > 0
                  ? "Enroll Now"
                  : "Enroll for Free"}
              </Button>
            )}

            <Button
              variant="outlined"
              size="large"
              startIcon={
                isTogglingWishlist ? (
                  <CircularProgress size={20} />
                ) : wishlisted ? (
                  <FavoriteIcon color="error" />
                ) : (
                  <FavoriteBorderIcon />
                )
              }
              onClick={onToggleWishlist}
              disabled={isTogglingWishlist}
              sx={{ fontWeight: 600, py: 1.2, borderRadius: 2 }}
            >
              {wishlisted ? "Added to Wishlist" : "Add to Wishlist"}
            </Button>
          </Stack>
        </div>
      </div>
    </Box>
  );
}
