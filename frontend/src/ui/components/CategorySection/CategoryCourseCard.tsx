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

interface CourseCardProps {
  course: ICourse;
}

export default function CategoryCourseCard({ course }: CourseCardProps) {
  const { title, instructor, image_path, thumbnail, rating = 4.5, price = 0 } = course;
  const instructorName =
    typeof instructor === "object" && instructor !== null
      ? instructor.name
      : typeof instructor === "string"
      ? instructor
      : "Expert Instructor";

  const resolvedImage = getImageUrl(thumbnail || image_path);

  return (
    <Card
      elevation={5}
      className="hover:!shadow-lg transition-shadow duration-300 p-5 m-5"
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
          <Rating value={rating} precision={0.5} readOnly size="small" />
          <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
            ₹{price}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
