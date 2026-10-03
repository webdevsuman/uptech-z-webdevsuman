"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import { IAnnouncement } from "@/typescript/interface/announcement.interface";
import { useDeleteAnnouncement } from "@/hooks/react-query/useAnnouncements";
import { sToast } from "@/components/ui/alert/stoast";

interface DeleteAnnouncementDialogProps {
  open: boolean;
  announcement: IAnnouncement | null;
  onClose: () => void;
}

export const DeleteAnnouncementDialog: React.FC<DeleteAnnouncementDialogProps> = ({
  open,
  announcement,
  onClose,
}) => {
  const deleteMutation = useDeleteAnnouncement();

  const handleDelete = async () => {
    if (!announcement) return;
    const id = announcement._id || announcement.id || "";
    try {
      await deleteMutation.mutateAsync(id);
      sToast.success("Announcement deleted successfully!");
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete announcement";
      sToast.error(msg);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>Delete Announcement?</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary">
          Are you sure you want to delete &ldquo;
          <strong>{announcement?.title}</strong>&rdquo;? This broadcast will no longer be visible
          to your students.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={deleteMutation.isPending} sx={{ textTransform: "none" }}>
          Cancel
        </Button>
        <Button
          onClick={handleDelete}
          variant="contained"
          color="error"
          disabled={deleteMutation.isPending}
          startIcon={deleteMutation.isPending ? <CircularProgress size={16} color="inherit" /> : null}
          sx={{ fontWeight: 700, textTransform: "none" }}
        >
          {deleteMutation.isPending ? "Deleting..." : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
