"use client";

import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Stack,
  CircularProgress,
  Divider,
} from "@mui/material";
import CampaignIcon from "@mui/icons-material/Campaign";
import { usePublicAnnouncements } from "@/hooks/react-query/useAnnouncements";
import { getImageUrl } from "@/utils/getImageUrl";

interface CourseAnnouncementsProps {
  courseId: string;
  instructorName?: string;
}

export default function CourseAnnouncements({
  courseId,
  instructorName,
}: CourseAnnouncementsProps) {
  const { data: announcements = [], isLoading } = usePublicAnnouncements({
    courseId,
  });

  if (isLoading) {
    return (
      <div className="md:px-24 px-5 max-w-7xl mx-auto my-8">
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress size={32} sx={{ color: "#5624D0" }} />
        </Box>
      </div>
    );
  }

  if (!announcements.length) {
    return null;
  }

  return (
    <div className="md:px-24 px-5 max-w-7xl mx-auto my-8">
      <Card
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
          p: 3,
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
            <CampaignIcon sx={{ color: "#5624D0", fontSize: 26 }} />
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#1c1d1f" }}>
              Instructor Announcements ({announcements.length})
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Important updates, schedule changes, and learning notices from{" "}
            <span className="font-semibold text-gray-800">
              {instructorName || "the instructor"}
            </span>
            .
          </Typography>

          <Stack spacing={3}>
            {announcements.map((ann, idx) => {
              const instructor =
                typeof ann.instructor === "object" ? ann.instructor : null;
              const dateStr = new Date(ann.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });

              return (
                <Box
                  key={ann._id || ann.id || idx}
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "grey.200",
                    bgcolor: "grey.50",
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1.5}
                    sx={{ alignItems: "center", mb: 2 }}
                  >
                    <Avatar
                      src={
                        instructor?.profilePicture
                          ? getImageUrl(instructor.profilePicture)
                          : undefined
                      }
                      sx={{
                        width: 36,
                        height: 36,
                        bgcolor: "#5624D0",
                        fontSize: "0.85rem",
                        fontWeight: 700,
                      }}
                    >
                      {instructor?.name?.[0]?.toUpperCase() || "I"}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {instructor?.name || instructorName || "Course Instructor"}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Posted on {dateStr}
                      </Typography>
                    </Box>
                  </Stack>

                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 700, mb: 1, color: "#1c1d1f" }}
                  >
                    {ann.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: "#374151",
                      lineHeight: 1.7,
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {ann.content}
                  </Typography>
                </Box>
              );
            })}
          </Stack>
        </CardContent>
      </Card>
    </div>
  );
}
