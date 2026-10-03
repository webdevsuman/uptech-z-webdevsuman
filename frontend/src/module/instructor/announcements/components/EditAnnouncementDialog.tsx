"use client";

import React, { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Typography,
  Chip,
  CircularProgress,
  Box,
} from "@mui/material";
import { School as CourseIcon } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IAnnouncement } from "@/typescript/interface/announcement.interface";
import { useUpdateAnnouncement } from "@/hooks/react-query/useAnnouncements";
import {
  updateAnnouncementSchema,
  UpdateAnnouncementFormData,
} from "../zod/announcement.zod";
import { sToast } from "@/components/ui/alert/stoast";

interface EditAnnouncementDialogProps {
  open: boolean;
  announcement: IAnnouncement | null;
  onClose: () => void;
}

export const EditAnnouncementDialog: React.FC<EditAnnouncementDialogProps> = ({
  open,
  announcement,
  onClose,
}) => {
  const updateMutation = useUpdateAnnouncement();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<UpdateAnnouncementFormData>({
    resolver: zodResolver(updateAnnouncementSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const titleValue = watch("title") || "";

  useEffect(() => {
    if (announcement) {
      reset({
        title: announcement.title || "",
        content: announcement.content || "",
      });
    }
  }, [announcement, reset]);

  const courseTitle =
    announcement && typeof announcement.course === "object" && announcement.course !== null
      ? announcement.course.title
      : "Selected Course";

  const onSubmit = async (data: UpdateAnnouncementFormData) => {
    if (!announcement) return;
    const id = announcement._id || announcement.id || "";

    try {
      await updateMutation.mutateAsync({
        id,
        title: data.title.trim(),
        content: data.content.trim(),
      });
      sToast.success("Announcement updated successfully!");
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update announcement";
      sToast.error(msg);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle sx={{ fontWeight: 700 }}>Edit Announcement</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mb: 0.5 }}
              >
                Target Course
              </Typography>
              <Chip
                icon={<CourseIcon sx={{ fontSize: "1rem !important" }} />}
                label={courseTitle}
                size="small"
                variant="outlined"
                color="primary"
                sx={{ fontWeight: 600 }}
              />
            </Box>

            {/* Announcement Title */}
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  size="small"
                  label="Announcement Title"
                  error={!!errors.title}
                  helperText={errors.title?.message || `${titleValue.length}/150 characters`}
                  slotProps={{ htmlInput: { maxLength: 150 } }}
                  disabled={updateMutation.isPending}
                />
              )}
            />

            {/* Announcement Content */}
            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  multiline
                  rows={5}
                  label="Announcement Content"
                  error={!!errors.content}
                  helperText={errors.content?.message}
                  disabled={updateMutation.isPending}
                />
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={onClose}
            disabled={updateMutation.isPending}
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={updateMutation.isPending}
            startIcon={
              updateMutation.isPending ? (
                <CircularProgress size={16} color="inherit" />
              ) : null
            }
            sx={{ fontWeight: 700, textTransform: "none" }}
          >
            {updateMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
