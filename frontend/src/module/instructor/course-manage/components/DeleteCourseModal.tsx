"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Stack,
  Box,
  CircularProgress,
} from "@mui/material";
import { WarningAmber as WarningIcon } from "@mui/icons-material";

interface DeleteCourseModalProps {
  open: boolean;
  courseTitle: string;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDraft?: boolean;
}

export const DeleteCourseModal: React.FC<DeleteCourseModalProps> = ({
  open,
  courseTitle,
  isDeleting,
  onClose,
  onConfirm,
  isDraft = true,
}) => {
  return (
    <Dialog
      open={open}
      onClose={isDeleting ? undefined : onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 2,
            p: 1,
          },
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              bgcolor: "error.light",
              color: "error.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <WarningIcon />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {isDraft ? "Discard Course Draft" : "Delete Course"}
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ py: 1 }}>
        <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
          Are you sure you want to permanently {isDraft ? "discard" : "delete"}{" "}
          <strong>&quot;{courseTitle}&quot;</strong>?
        </Typography>
        <Typography
          variant="caption"
          sx={{
            display: "block",
            bgcolor: "action.hover",
            p: 1.5,
            borderRadius: 1,
            color: "error.main",
            fontWeight: 600,
          }}
        >
          Warning: This action cannot be reversed. All course settings, landing page
          details, and media will be permanently deleted.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, pt: 1 }}>
        <Button
          variant="outlined"
          color="inherit"
          onClick={onClose}
          disabled={isDeleting}
          sx={{ textTransform: "none", fontWeight: 600 }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={onConfirm}
          disabled={isDeleting}
          sx={{ textTransform: "none", fontWeight: 700, px: 2.5 }}
        >
          {isDeleting ? (
            <CircularProgress size={18} color="inherit" />
          ) : isDraft ? (
            "Discard Draft"
          ) : (
            "Delete Course"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
