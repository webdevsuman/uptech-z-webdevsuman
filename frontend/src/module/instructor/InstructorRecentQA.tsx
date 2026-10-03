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
  CircularProgress,
} from "@mui/material";
import { getInitials } from "@/utils/functions/label.lib";
import { useInstructorQuestions } from "@/hooks/react-query/useQnA";
import { getImageUrl } from "@/utils/getImageUrl";

const formatTimeAgo = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  if (diffMins < 60) return `${Math.max(1, diffMins)}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
};

export const InstructorRecentQA: React.FC = () => {
  const { data, isLoading } = useInstructorQuestions({ limit: 4 });

  const questions = data?.questions ?? [];
  const unansweredCount = data?.counts?.unanswered ?? 0;

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
                label={unansweredCount > 0 ? `${unansweredCount} Unanswered` : "Up to date"}
                color={unansweredCount > 0 ? "warning" : "success"}
                sx={{
                  height: 20,
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  borderRadius: 1,
                }}
              />
            </Stack>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Recent questions from your courses
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

        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress size={28} />
          </Box>
        ) : questions.length === 0 ? (
          <Box
            sx={{
              p: 3,
              textAlign: "center",
              borderRadius: 1.5,
              border: "1px dashed",
              borderColor: "divider",
              bgcolor: "grey.50",
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600, color: "text.secondary" }}>
              No student questions yet
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Questions asked by enrolled students will appear here.
            </Typography>
          </Box>
        ) : (
          <Stack spacing={2}>
            {questions.map((q) => {
              const qId = q._id || q.id;
              const studentName = q.user?.name || "Student";
              const courseTitle =
                typeof q.course === "object" && q.course !== null
                  ? q.course.title
                  : "Course";
              const isUnanswered =
                !q.answers ||
                q.answers.length === 0 ||
                !q.answers.some((a) => a.isInstructor);

              return (
                <Box
                  key={qId}
                  sx={{
                    p: 1.5,
                    borderRadius: 1.5,
                    bgcolor: (theme) =>
                      theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.03)"
                        : "rgba(0, 0, 0, 0.02)",
                    border: "1px solid",
                    borderColor: isUnanswered ? "warning.light" : "divider",
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
                        src={q.user?.profilePicture ? getImageUrl(q.user.profilePicture) : undefined}
                        sx={{
                          width: 28,
                          height: 28,
                          fontSize: "0.75rem",
                          bgcolor: "#5624D0",
                          fontWeight: 700,
                        }}
                      >
                        {getInitials(studentName)}
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
                          {studentName}
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
                          {courseTitle}
                        </Typography>
                      </Box>
                    </Stack>
                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary", fontSize: "0.75rem" }}
                    >
                      {formatTimeAgo(q.createdAt)}
                    </Typography>
                  </Stack>

                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.primary",
                      fontWeight: 600,
                      fontSize: "0.8rem",
                      mb: 0.5,
                    }}
                  >
                    {q.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    noWrap
                    sx={{
                      color: "text.secondary",
                      fontSize: "0.78rem",
                      mb: 1,
                      lineHeight: 1.4,
                    }}
                  >
                    {q.content}
                  </Typography>

                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Chip
                      size="small"
                      label={isUnanswered ? "Needs reply" : `${q.answers.length} replies`}
                      color={isUnanswered ? "warning" : "default"}
                      sx={{ height: 18, fontSize: "0.65rem", fontWeight: 600 }}
                    />
                    <Button
                      component={Link}
                      href={`/instructor/qa?courseId=${typeof q.course === "object" ? q.course._id : q.course}`}
                      sx={{
                        fontSize: "0.75rem",
                        p: 0,
                        minWidth: "auto",
                        fontWeight: 700,
                        textTransform: "none",
                        color: "#5624D0",
                      }}
                    >
                      Answer →
                    </Button>
                  </Box>
                </Box>
              );
            })}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};
