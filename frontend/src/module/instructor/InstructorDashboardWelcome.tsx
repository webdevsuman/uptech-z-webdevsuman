"use client";

import React from "react";
import Link from "next/link";
import { Paper, Box, Stack, Typography, Button, Chip } from "@mui/material";
import { Add as AddIcon, MenuBook as MenuBookIcon } from "@mui/icons-material";
import { useAuth } from "@/context/AuthContext";

export const InstructorDashboardWelcome: React.FC = () => {
  const { user } = useAuth();
  const firstName = user?.name ? user.name.split(" ")[0] : "Instructor";

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, md: 4 },
        borderRadius: 2,
        background: (theme) =>
          theme.palette.mode === "dark"
            ? "linear-gradient(135deg, #3A188C 0%, #201048 100%)"
            : "linear-gradient(135deg, #5624D0 0%, #7B3FE4 100%)",
        color: "#FFFFFF",
      }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        sx={{
          alignItems: { xs: "flex-start", md: "center" },
          justifyContent: "space-between",
        }}
        spacing={3}
      >
        <Box sx={{ maxWidth: 640 }}>
          <Chip
            size="small"
            label="Instructor Studio Active"
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.2)",
              color: "#FFFFFF",
              fontWeight: 600,
              fontSize: "0.75rem",
              mb: 1.5,
              borderRadius: 1,
            }}
          />
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "1.35rem", md: "1.65rem" },
              lineHeight: 1.2,
              mb: 1,
            }}
          >
            Welcome back, {firstName}!
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "rgba(255, 255, 255, 0.9)",
              lineHeight: 1.6,
              fontSize: "0.875rem",
            }}
          >
            Track student performance, manage course curriculum, and expand your
            educational reach.
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
};
