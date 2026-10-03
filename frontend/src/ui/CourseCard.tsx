import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Rating,
  Box,
  Button,
} from "@mui/material";

interface CourseCardProps {
  title: string;
  instructor: string;
  image_path: string;
  rating: number;
  price: number;
  istrending?: boolean;
  isfeatured?: boolean;
}

export default function CourseCard({
  title,
  instructor,
  image_path,
  rating,
  price,
  isfeatured,
  istrending,
}: CourseCardProps) {
  return (
    <Card
      elevation={5}
      className="hover:shadow-lg! transition-shadow duration-300 p-5 m-5"
    >
      <CardMedia component="img" height="140" image={image_path} alt={title} />
      <CardContent>
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {instructor}
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            my: 1,
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
        <div className="flex gap-4">
          {istrending && (
            <Button variant="contained" size="small" className="bg-[#07393C]!">
              Trending
            </Button>
          )}
          {isfeatured && (
            <Button variant="contained" size="small">
              Featured
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
