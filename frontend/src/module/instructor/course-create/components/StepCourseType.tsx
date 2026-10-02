"use client";

import React from "react";
import { Box, Typography, Stack, Card, CardContent } from "@mui/material";
import {
  OndemandVideo as VideoIcon,
  AssignmentTurnedIn as QuizIcon,
} from "@mui/icons-material";

interface StepCourseTypeProps {
  value: "course" | "practice";
  onChange: (val: "course" | "practice") => void;
}

export const StepCourseType: React.FC<StepCourseTypeProps> = ({
  value,
  onChange,
}) => {
  return (
    <Stack spacing={4} sx={{ width: "100%", maxWidth: 720, mx: "auto", py: 2 }}>
      <Box sx={{ textAlign: "center" }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: 700, color: "text.primary", mb: 1 }}
        >
          First, let&apos;s find out what type of course you&apos;re making.
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Choose the learning experience you want to create for your students.
        </Typography>
      </Box>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={3}
        sx={{ width: "100%" }}
      >
        {/* Option 1: Course */}
        <Card
          onClick={() => onChange("course")}
          sx={{
            flex: 1,
            cursor: "pointer",
            p: 2,
            border: "2px solid",
            borderColor: value === "course" ? "primary.main" : "divider",
            bgcolor:
              value === "course"
                ? (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(86, 36, 208, 0.12)"
                      : "rgba(86, 36, 208, 0.04)"
                : "background.paper",
            transition: "all 0.25s ease-in-out",
            "&:hover": {
              borderColor: "primary.main",
              transform: "translateY(-2px)",
              boxShadow: 3,
            },
          }}
        >
          <CardContent sx={{ textAlign: "center", p: 3 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                bgcolor:
                  value === "course" ? "primary.main" : "action.hover",
                color: value === "course" ? "#FFFFFF" : "text.secondary",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 2.5,
                transition: "all 0.2s ease",
              }}
            >
              <VideoIcon sx={{ fontSize: "2rem" }} />
            </Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
              Course
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", fontSize: "0.85rem", lineHeight: 1.6 }}
            >
              Create rich learning experiences with the help of video lectures,
              quizzes, coding exercises, and downloadable resources.
            </Typography>
          </CardContent>
        </Card>

        {/* Option 2: Practice Test */}
        <Card
          onClick={() => onChange("practice")}
          sx={{
            flex: 1,
            cursor: "pointer",
            p: 2,
            border: "2px solid",
            borderColor: value === "practice" ? "primary.main" : "divider",
            bgcolor:
              value === "practice"
                ? (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(86, 36, 208, 0.12)"
                      : "rgba(86, 36, 208, 0.04)"
                : "background.paper",
            transition: "all 0.25s ease-in-out",
            "&:hover": {
              borderColor: "primary.main",
              transform: "translateY(-2px)",
              boxShadow: 3,
            },
          }}
        >
          <CardContent sx={{ textAlign: "center", p: 3 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                bgcolor:
                  value === "practice" ? "primary.main" : "action.hover",
                color: value === "practice" ? "#FFFFFF" : "text.secondary",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 2.5,
                transition: "all 0.2s ease",
              }}
            >
              <QuizIcon sx={{ fontSize: "2rem" }} />
            </Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
              Practice Test
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", fontSize: "0.85rem", lineHeight: 1.6 }}
            >
              Help students prepare for professional certification exams by
              providing rigorous practice questions and timed mock tests.
            </Typography>
          </CardContent>
        </Card>
      </Stack>
    </Stack>
  );
};
