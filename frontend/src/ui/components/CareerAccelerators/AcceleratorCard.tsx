import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Paper,
  Typography,
} from "@mui/material";
import React from "react";

interface AcceleratorCard {
  title: string;
  image_path: string;
  stars: number;
  ratings: string;
  hours: string;
}

export const AcceleratorCard = ({
  title,
  image_path,
  stars,
  ratings,
  hours,
}: AcceleratorCard) => {
  return (
    <Card
      elevation={5}
      className="p-5 m-5 w-[350px]"
    >
      <CardMedia className="max-h-[180px]" component="img" height={200} image={image_path} alt={title} />
      <CardContent>
        <Typography variant="subtitle1" fontWeight="bold">
          {title}
        </Typography>

        <Box className="flex gap-4 mt-2">
          <Paper elevation={2} className="px-2 py-1">
            <Typography color="gray">⭐{stars}</Typography>
          </Paper>
          <Paper elevation={2} className="px-2 py-1">
            <Typography color="gray" variant="subtitle2">{ratings} ratings</Typography>
          </Paper>
          <Paper elevation={2} className="px-2 py-1">
            <Typography color="gray" variant="subtitle2">{hours} total hours</Typography>
          </Paper>
        </Box>
      </CardContent>
    </Card>
  );
};
