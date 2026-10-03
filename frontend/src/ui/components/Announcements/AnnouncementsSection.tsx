"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Stack,
  CircularProgress,
} from "@mui/material";
import CampaignIcon from "@mui/icons-material/Campaign";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { usePublicAnnouncements } from "@/hooks/react-query/useAnnouncements";
import { IAnnouncement } from "@/typescript/interface/announcement.interface";
import { getImageUrl } from "@/utils/getImageUrl";

interface AnnouncementsSectionProps {
  title?: string;
  description?: string;
}

export default function AnnouncementsSection({
  title = "Latest Announcements",
  description = "Stay informed with recent updates, webinars, and instructor notices across all courses.",
}: AnnouncementsSectionProps) {
  const { data: announcements = [], isLoading } = usePublicAnnouncements({limit:6});
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<IAnnouncement | null>(null);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress size={36} sx={{ color: "#5624D0" }} />
      </Box>
    );
  }

  if (!announcements.length) {
    return null;
  }

  return (
    <section className="py-10 md:px-20 px-5 max-w-7xl mx-auto">
      <div className="mb-8">
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}>
          <CampaignIcon sx={{ color: "#5624D0", fontSize: 28 }} />
          <Typography variant="h5" sx={{ fontWeight: 800, color: "#1c1d1f" }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {announcements.map((ann) => {
          const course = typeof ann.course === "object" ? ann.course : null;
          const instructor = typeof ann.instructor === "object" ? ann.instructor : null;
          const courseId = course?._id || course?.id;

          const dateStr = new Date(ann.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });

          return (
            <Card
              key={ann._id || ann.id}
              elevation={1}
              sx={{
                borderRadius: 3,
                border: "1px solid",
                borderColor: "grey.200",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  boxShadow: 4,
                  transform: "translateY(-3px)",
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, gap: 1 }}>
                  {course ? (
                    <Link href={`/courses/${courseId}`} style={{ textDecoration: "none" }}>
                      <Chip
                        label={course.title}
                        size="small"
                        sx={{
                          maxWidth: 180,
                          bgcolor: "rgba(86,36,208,0.08)",
                          color: "#5624D0",
                          fontWeight: 700,
                          fontSize: "0.75rem",
                          cursor: "pointer",
                        }}
                      />
                    </Link>
                  ) : (
                    <Chip label="Platform Update" size="small" variant="outlined" />
                  )}
                  <Typography variant="caption" color="text.secondary">
                    {dateStr}
                  </Typography>
                </Box>

                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 700,
                    lineHeight: 1.3,
                    mb: 1,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    color: "#1c1d1f",
                  }}
                >
                  {ann.title}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 2,
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    lineHeight: 1.5,
                  }}
                >
                  {ann.content}
                </Typography>
              </CardContent>

              <Box
                sx={{
                  p: 2,
                  px: 3,
                  pt: 0,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderTop: "1px solid",
                  borderColor: "grey.100",
                  mt: "auto",
                }}
              >
                <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                  <Avatar
                    src={instructor?.profilePicture ? getImageUrl(instructor.profilePicture) : undefined}
                    sx={{ width: 26, height: 26, fontSize: "0.75rem", bgcolor: "#5624D0" }}
                  >
                    {instructor?.name?.[0]?.toUpperCase() || "I"}
                  </Avatar>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: "text.primary" }}>
                    {instructor?.name || "Course Instructor"}
                  </Typography>
                </Stack>

                <Button
                  size="small"
                  onClick={() => setSelectedAnnouncement(ann)}
                  endIcon={<ArrowForwardIcon sx={{ fontSize: "14px !important" }} />}
                  sx={{
                    textTransform: "none",
                    fontWeight: 700,
                    fontSize: "0.8rem",
                    color: "#5624D0",
                    p: 0,
                    "&:hover": { bgcolor: "transparent", textDecoration: "underline" },
                  }}
                >
                  Read More
                </Button>
              </Box>
            </Card>
          );
        })}
      </div>

      {/* Announcement Detail Modal */}
      <Dialog
        open={Boolean(selectedAnnouncement)}
        onClose={() => setSelectedAnnouncement(null)}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: { borderRadius: 3, p: 1 },
          },
        }}
      >
        <DialogTitle sx={{ m: 0, p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CampaignIcon sx={{ color: "#5624D0" }} />
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Announcement
            </Typography>
          </Box>
          <IconButton onClick={() => setSelectedAnnouncement(null)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 3 }}>
          {selectedAnnouncement && (
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5, color: "#1c1d1f" }}>
                {selectedAnnouncement.title}
              </Typography>

              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 2 }}>
                Posted on {new Date(selectedAnnouncement.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </Typography>

              <Typography variant="body1" sx={{ color: "#374151", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
                {selectedAnnouncement.content}
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2, justifyContent: "space-between" }}>
          {typeof selectedAnnouncement?.course === "object" && selectedAnnouncement?.course?._id ? (
            <Link
              href={`/courses/${selectedAnnouncement.course._id}`}
              passHref
              style={{ textDecoration: "none" }}
            >
              <Button variant="outlined" size="small" sx={{ textTransform: "none", fontWeight: 700 }}>
                Go to Course Page
              </Button>
            </Link>
          ) : (
            <div />
          )}
          <Button
            variant="contained"
            size="small"
            onClick={() => setSelectedAnnouncement(null)}
            sx={{ bgcolor: "#5624D0", fontWeight: 700, textTransform: "none", "&:hover": { bgcolor: "#401b9c" } }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </section>
  );
}
