import { Typography } from "@mui/material";
import React from "react";

export const TitleSubheading = ({
  title,
  subheading,
}: {
  title: string;
  subheading?: string;
}) => {
  return (
    <>
      <Typography variant="h4" sx={{ fontWeight: "bold" }} gutterBottom>
        {title}
      </Typography>

      <Typography variant="h6" sx={{ color: "gray" }}>
        {subheading}
      </Typography>
    </>
  );
};
