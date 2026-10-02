"use client";

import React from "react";
import {
  Box,
  Typography,
  Stack,
  TextField,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { useCategories } from "@/hooks/react-query/useCategories";

interface StepCourseCategoryProps {
  value: string;
  onChange: (val: string) => void;
  error?: string;
}

export const StepCourseCategory: React.FC<StepCourseCategoryProps> = ({
  value,
  onChange,
  error,
}) => {
  const { data: categories, isLoading, isError } = useCategories();

  return (
    <Stack spacing={4} sx={{ width: "100%", maxWidth: 640, mx: "auto", py: 2 }}>
      <Box sx={{ textAlign: "center" }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: 700, color: "text.primary", mb: 1 }}
        >
          What category best fits the knowledge you&apos;ll share?
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          If you&apos;re not sure about the right category, you can change it later.
        </Typography>
      </Box>

      <Box sx={{ width: "100%" }}>
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress size={32} />
          </Box>
        ) : isError ? (
          <Typography color="error" variant="body2" sx={{ textAlign: "center" }}>
            Failed to load categories. Please refresh or try again.
          </Typography>
        ) : (
          <TextField
            select
            fullWidth
            value={value}
            onChange={(e) => onChange(e.target.value)}
            variant="outlined"
            error={Boolean(error)}
            helperText={error || "Select the main subject area for your course."}
            slotProps={{
              select: {
                displayEmpty: true,
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                fontSize: "1rem",
              },
            }}
          >
            <MenuItem value="" disabled>
              <em>Choose a category</em>
            </MenuItem>
            {categories?.map((cat) => (
              <MenuItem key={cat._id} value={cat._id}>
                {cat.name}
              </MenuItem>
            ))}
          </TextField>
        )}
      </Box>
    </Stack>
  );
};
