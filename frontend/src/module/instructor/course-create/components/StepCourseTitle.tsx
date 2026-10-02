"use client";

import React from "react";
import { Box, Typography, Stack, TextField, InputAdornment } from "@mui/material";

interface StepCourseTitleProps {
  value: string;
  onChange: (val: string) => void;
  error?: string;
}

export const StepCourseTitle: React.FC<StepCourseTitleProps> = ({
  value,
  onChange,
  error,
}) => {
  const maxLength = 100;
  const remaining = maxLength - value.length;

  return (
    <Stack spacing={4} sx={{ width: "100%", maxWidth: 640, mx: "auto", py: 2 }}>
      <Box sx={{ textAlign: "center" }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: 700, color: "text.primary", mb: 1 }}
        >
          How about a working title?
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          It&apos;s ok if you can&apos;t think of a good title now. You can change it later.
        </Typography>
      </Box>

      <Box sx={{ width: "100%" }}>
        <TextField
          fullWidth
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
          placeholder="e.g. Learn Photoshop CC 2026 from Scratch"
          variant="outlined"
          error={Boolean(error)}
          helperText={error || "Your title should be catchy, informative, and at least 5 characters."}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <Typography
                    variant="caption"
                    sx={{
                      color: remaining < 10 ? "warning.main" : "text.secondary",
                      fontWeight: 600,
                    }}
                  >
                    {remaining}
                  </Typography>
                </InputAdornment>
              ),
            },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              fontSize: "1.05rem",
              py: 0.5,
            },
          }}
        />
      </Box>
    </Stack>
  );
};
