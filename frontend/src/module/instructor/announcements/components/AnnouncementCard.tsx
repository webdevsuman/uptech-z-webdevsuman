"use client";

import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Chip,
  IconButton,
  Tooltip,
  Divider,
} from "@mui/material";
import {
  EditOutlined as EditIcon,
  DeleteOutlined as DeleteIcon,
  AccessTime as TimeIcon,
  School as CourseIcon,
} from "@mui/icons-material";
import { IAnnouncement } from "@/typescript/interface/announcement.interface";

interface AnnouncementCardProps {
  announcement: IAnnouncement;
  onEdit: (announcement: IAnnouncement) => void;
  onDelete: (announcement: IAnnouncement) => void;
}

export const AnnouncementCard: React.FC<AnnouncementCardProps> = ({
  announcement,
  onEdit,
  onDelete,
}) => {
  const courseTitle =
    typeof announcement.course === "object" && announcement.course !== null
      ? announcement.course.title
      : "Course Announcement";

  const formattedDate = announcement.createdAt
    ? new Date(announcement.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 2.5,
        transition: "border-color 0.2s, box-shadow 0.2s",
        "&:hover": {
          borderColor: "primary.light",
          boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
        },
      }}
    >
      <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          sx={{
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            mb: 2,
          }}
          spacing={1.5}
        >
          <Stack
            direction="row"
            spacing={1}
            sx={{ alignItems: "center", flexWrap: "wrap" }}
          >
            <Chip
              icon={<CourseIcon sx={{ fontSize: "1rem !important" }} />}
              label={courseTitle}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ fontWeight: 600, maxWidth: 280 }}
            />
            {formattedDate && (
              <Stack
                direction="row"
                spacing={0.5}
                sx={{ alignItems: "center" }}
              >
                <TimeIcon
                  sx={{ fontSize: "0.9rem", color: "text.secondary" }}
                />
                <Typography variant="caption" color="text.secondary">
                  {formattedDate}
                </Typography>
              </Stack>
            )}
          </Stack>

          <Stack direction="row" spacing={0.5}>
            <Tooltip title="Edit announcement">
              <IconButton
                size="small"
                onClick={() => onEdit(announcement)}
                sx={{
                  color: "text.secondary",
                  "&:hover": { color: "primary.main", bgcolor: "primary.50" },
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete announcement">
              <IconButton
                size="small"
                onClick={() => onDelete(announcement)}
                sx={{
                  color: "text.secondary",
                  "&:hover": { color: "error.main", bgcolor: "error.50" },
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>

        <Typography
          variant="h6"
          sx={{ fontWeight: 700, mb: 1.5, color: "text.primary" }}
        >
          {announcement.title}
        </Typography>

        <Divider sx={{ mb: 1.5, opacity: 0.6 }} />

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            lineHeight: 1.6,
          }}
        >
          {announcement.content}
        </Typography>
      </CardContent>
    </Card>
  );
};
