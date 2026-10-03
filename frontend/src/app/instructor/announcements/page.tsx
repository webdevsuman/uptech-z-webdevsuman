"use client";

import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  Stack,
  Button,
  Paper,
  Skeleton,
} from "@mui/material";
import {
  CampaignOutlined as CampaignIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { useInstructorAnnouncements } from "@/hooks/react-query/useAnnouncements";
import { IAnnouncement } from "@/typescript/interface/announcement.interface";
import { AnnouncementsHeader } from "@/module/instructor/announcements/components/AnnouncementsHeader";
import { AnnouncementCard } from "@/module/instructor/announcements/components/AnnouncementCard";
import { CreateAnnouncementDialog } from "@/module/instructor/announcements/components/CreateAnnouncementDialog";
import { EditAnnouncementDialog } from "@/module/instructor/announcements/components/EditAnnouncementDialog";
import { DeleteAnnouncementDialog } from "@/module/instructor/announcements/components/DeleteAnnouncementDialog";

export default function InstructorAnnouncementsPage() {
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<IAnnouncement | null>(null);
  const [deletingAnnouncement, setDeletingAnnouncement] = useState<IAnnouncement | null>(null);

  const {
    data: announcements,
    isLoading,
    isError,
  } = useInstructorAnnouncements(selectedCourseId);

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 3 } }}>
      <AnnouncementsHeader
        selectedCourseId={selectedCourseId}
        onSelectCourse={setSelectedCourseId}
        onOpenCreate={() => setIsCreateOpen(true)}
      />

      {/* Loading Skeleton */}
      {isLoading && (
        <Stack spacing={2.5}>
          {[1, 2, 3].map((item) => (
            <Skeleton
              key={item}
              variant="rounded"
              height={140}
              sx={{ borderRadius: 2.5 }}
            />
          ))}
        </Stack>
      )}

      {/* Error State */}
      {!isLoading && isError && (
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: "center",
            border: "1px solid",
            borderColor: "error.light",
            bgcolor: "error.50",
            borderRadius: 2.5,
          }}
        >
          <Typography variant="h6" color="error" gutterBottom sx={{ fontWeight: 700 }}>
            Unable to Load Announcements
          </Typography>
          <Typography variant="body2" color="text.secondary">
            An error occurred while fetching your course broadcasts. Please try refreshing.
          </Typography>
        </Paper>
      )}

      {/* Empty State */}
      {!isLoading && !isError && announcements && announcements.length === 0 && (
        <Paper
          elevation={0}
          sx={{
            py: 8,
            px: 3,
            textAlign: "center",
            border: "1px dashed",
            borderColor: "divider",
            borderRadius: 3,
            bgcolor: "background.paper",
          }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              bgcolor: "primary.50",
              color: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 2,
            }}
          >
            <CampaignIcon sx={{ fontSize: 34 }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            No Announcements Found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 450, mx: "auto", mb: 3 }}>
            {selectedCourseId
              ? "There are no announcements for the selected course yet. Broadcast your first message!"
              : "You haven't posted any announcements yet. Keep your students updated on course materials and news."}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setIsCreateOpen(true)}
            sx={{ textTransform: "none", fontWeight: 700, borderRadius: 2, justifySelf:"end" }}
          >
            Create Announcement
          </Button>
        </Paper>
      )}

      {/* Announcement List */}
      {!isLoading && !isError && announcements && announcements.length > 0 && (
        <Stack spacing={2.5}>
          {announcements.map((announcement) => {
            const id = announcement._id || announcement.id || "";
            return (
              <AnnouncementCard
                key={id}
                announcement={announcement}
                onEdit={(item) => setEditingAnnouncement(item)}
                onDelete={(item) => setDeletingAnnouncement(item)}
              />
            );
          })}
        </Stack>
      )}

      {/* Modals */}
      <CreateAnnouncementDialog
        open={isCreateOpen}
        defaultCourseId={selectedCourseId}
        onClose={() => setIsCreateOpen(false)}
      />

      <EditAnnouncementDialog
        open={!!editingAnnouncement}
        announcement={editingAnnouncement}
        onClose={() => setEditingAnnouncement(null)}
      />

      <DeleteAnnouncementDialog
        open={!!deletingAnnouncement}
        announcement={deletingAnnouncement}
        onClose={() => setDeletingAnnouncement(null)}
      />
    </Container>
  );
}
