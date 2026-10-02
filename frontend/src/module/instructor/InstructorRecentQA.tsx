"use client";

import React from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Avatar,
  Chip,
  Button,
  Box,
} from "@mui/material";
import { getInitials } from "@/utils/functions/label.lib";

interface QAItem {
  id: string;
  studentName: string;
  courseTitle: string;
  question: string;
  timeAgo: string;
}

const sampleQuestions: QAItem[] = [
  {
    id: "q-1",
    studentName: "Sarah Jenkins",
    courseTitle: "Mastering React 19 & Next.js 16",
    question:
      "How do Server Actions handle authentication cookies in Next.js 16 proxy?",
    timeAgo: "25m ago",
  },
  {
    id: "q-2",
    studentName: "Alex Rivera",
    courseTitle: "Complete Modern Full-Stack Bootcamp",
    question:
      "Getting a CORS preflight error when uploading media directly to Cloudinary via stream.",
    timeAgo: "2h ago",
  },
  {
    id: "q-3",
    studentName: "Michael Chen",
    courseTitle: "Cloud Architecture & Docker Essentials",
    question:
      "Is multi-stage Docker build recommended for Next.js standalone output?",
    timeAgo: "5h ago",
  },
];

export const InstructorRecentQA: React.FC = () => {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack
          direction="row"
          sx={{ alignItems: "center", justifyContent: "space-between", mb: 2 }}
        >
          <Box>
            <Stack direction="row" sx={{ alignItems: "center" }} spacing={1}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 700, color: "text.primary" }}
              >
                Student Q&A
              </Typography>
              <Chip
                size="small"
                label="3 New"
                color="primary"
                sx={{
                  height: 20,
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  borderRadius: 1,
                }}
              />
            </Stack>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Recent unanswered questions
            </Typography>
          </Box>
          <Button
            component={Link}
            href="/instructor/qa"
            color="primary"
            sx={{ fontWeight: 600, fontSize: "0.8rem", textTransform: "none" }}
          >
            View All
          </Button>
        </Stack>

        <Stack spacing={2}>
          {sampleQuestions.map((qa) => (
            <Box
              key={qa.id}
              sx={{
                p: 1.5,
                borderRadius: 1.5,
                bgcolor: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.03)"
                    : "rgba(0, 0, 0, 0.02)",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Stack
                direction="row"
                sx={{
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Stack
                  direction="row"
                  sx={{ alignItems: "center" }}
                  spacing={1}
                >
                  <Avatar
                    sx={{
                      width: 28,
                      height: 28,
                      fontSize: "0.75rem",
                      bgcolor: "primary.main",
                      fontWeight: 700,
                    }}
                  >
                    {getInitials(qa.studentName)}
                  </Avatar>
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: "text.primary",
                        lineHeight: 1.2,
                        fontSize: "0.85rem",
                      }}
                    >
                      {qa.studentName}
                    </Typography>
                    <Typography
                      variant="caption"
                      noWrap
                      sx={{
                        color: "text.secondary",
                        maxWidth: 160,
                        display: "block",
                        fontSize: "0.75rem",
                      }}
                    >
                      {qa.courseTitle}
                    </Typography>
                  </Box>
                </Stack>
                <Typography
                  variant="caption"
                  sx={{ color: "text.secondary", fontSize: "0.75rem" }}
                >
                  {qa.timeAgo}
                </Typography>
              </Stack>

              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  fontSize: "0.8rem",
                  mb: 1,
                  lineHeight: 1.4,
                }}
              >
                &ldquo;{qa.question}&rdquo;
              </Typography>

              <Box sx={{ textAlign: "right" }}>
                <Button
                  component={Link}
                  href={`/instructor/qa#${qa.id}`}
                  sx={{
                    fontSize: "0.75rem",
                    p: 0,
                    minWidth: "auto",
                    fontWeight: 600,
                    textTransform: "none",
                  }}
                >
                  Reply →
                </Button>
              </Box>
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};
