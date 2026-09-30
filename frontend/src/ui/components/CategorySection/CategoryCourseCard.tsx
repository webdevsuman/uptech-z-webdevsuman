import { ICourse } from "@/typescript/interface/course";
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

export default function CategoryCourseCard({
  course: { title, instructor, image_path, rating, price },
}: CourseCardProps) {

  return (
    <Card
      elevation={5}
      className="hover:!shadow-lg transition-shadow duration-300 p-5 m-5"
    >
      <CardMedia component="img" height="140" image={getImageUrl(image_path)} alt={title} />
      <CardContent>
        <Typography variant="subtitle1" fontWeight="bold">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {instructor}
        </Typography>

        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mt={1}
        >
          <Rating value={rating} precision={0.5} readOnly size="small" />
          <Typography variant="subtitle2" fontWeight="bold">
            ₹{price}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
