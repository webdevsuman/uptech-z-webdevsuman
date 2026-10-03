import { ICourse } from "@/typescript/interface/course.interface";
import { getImageUrl } from "@/utils/getImageUrl";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Rating,
  Box,
} from "@mui/material";

import Link from "next/link";

interface CourseCardProps {
  course: ICourse;
}

export default function CategoryCourseCard({ course }: CourseCardProps) {
  const { title, instructor, image_path, thumbnail, rating = 0, price = 0 } = course;
  const courseId = course._id || course.id;
  const instructorName =
    typeof instructor === "object" && instructor !== null
      ? instructor.name
      : typeof instructor === "string"
      ? instructor
      : "Expert Instructor";

  const resolvedImage = getImageUrl(thumbnail || image_path);

  return (
    <Link href={`/courses/${courseId}`} style={{ textDecoration: "none", color: "inherit" }}>
      <Card
        elevation={5}
        className="hover:shadow-lg! transition-shadow duration-300 p-5 m-5"
      >
      <CardMedia component="img" height="140" image={resolvedImage} alt={title} />
      <CardContent>
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {instructorName}
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mt: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Typography variant="caption" sx={{ fontWeight: "bold", color: "#b4690e" }}>
              {rating > 0 ? rating.toFixed(1) : "New"}
            </Typography>
            <Rating value={rating} precision={0.1} readOnly size="small" />
          </Box>
          <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
            {price > 0 ? `₹${price}` : "Free"}
          </Typography>
        </Box>
      </CardContent>
    </Card>
    </Link>
  );
}
