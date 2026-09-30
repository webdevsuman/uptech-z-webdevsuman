"use client";

import { Box, Typography, Button, Stack, CardMedia } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { CourseHeaderProps } from "@/typescript/types/course";
import { Instructor } from "./CourseInstructor";
import { getImageUrl } from "@/utils/getImageUrl";

export default function CourseHeader({
  course,
  photo_url,
  instructor,
  wishlisted,
  enrolled,
  onToggleWishlist,
  onEnroll,
}: {
  course: CourseHeaderProps["course"];
  photo_url: string;
  instructor: Instructor | null;
  wishlisted: boolean;
  enrolled: boolean;
  onToggleWishlist: () => void;
  onEnroll: () => void;
}) {
  // console.log("Course data:", course);
  // console.log("Instructor data:",instructor);

  return (
    <Box>
      <div className="bg-blend-darken bg-[#191a25] text-gray-200 py-10 md:px-30 px-5 flex flex-col md:grid grid-cols-5 gap-20">
        <div className=" flex flex-col gap-5 col-span-3">
          {/* Title */}
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {course.title}
          </Typography>
          <Typography variant="body1" className=" line-clamp-2">
            {course.description}
          </Typography>

          <Typography>
            Created by{" "}
            <span className="underline text-[#5624D0]">
              {" "}
              {Array.isArray(instructor)
                ? instructor[0]?.name
                : instructor?.name}
            </span>
          </Typography>
          {/* Rating + reviews */}
          <Stack direction="row" spacing={1} alignItems="center" mb={2}>
            <Typography color="#FFE234" className=" !font-bold">
              {course.rating} ⭐
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ({course.reviews?.length || 0} reviews)
            </Typography>
          </Stack>
        </div>
        <div className="col-span-2 bg-white flex flex-col gap-5 py-2 px-6">
          <CardMedia
            className=" self-center"
            sx={{ height: 200, width: 350 }}
            image={`${getImageUrl(photo_url)}`}
            title="green iguana"
          />
          {/* Price */}
          <Typography
            variant="h5"
            fontWeight="bold"
            className="text-gray-800"
          >
            ₹{course.price}
          </Typography>
          {/* Actions */}
          <Stack direction="column" spacing={2}>
            <Button color="primary"
              variant="contained"
              startIcon={<ShoppingCartIcon />}
              onClick={onEnroll}
              disabled={enrolled}
            >
              {enrolled ? "Enrolled" : "Enroll Now"}
            </Button>

            <Button
              variant="outlined"
              startIcon={
                wishlisted ? (
                  <FavoriteIcon color="error" />
                ) : (
                  <FavoriteBorderIcon />
                )
              }
              onClick={onToggleWishlist}
            >
              {wishlisted ? "Wishlisted" : "Add to Wishlist"}
            </Button>
          </Stack>
        </div>
      </div>
    </Box>
  );
}
