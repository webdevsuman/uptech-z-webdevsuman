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
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h6" color="gray">
        {subheading}
      </Typography>
    </>
  );
};
