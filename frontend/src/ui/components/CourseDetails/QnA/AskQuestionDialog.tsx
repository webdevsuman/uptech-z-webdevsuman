"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutlined";
import { useAskQuestion } from "@/hooks/react-query/useQnA";
import { sToast } from "@/components/ui/alert/stoast";

interface AskQuestionDialogProps {
  open: boolean;
  courseId: string;
  onClose: () => void;
}

export default function AskQuestionDialog({
  open,
  courseId,
  onClose,
}: AskQuestionDialogProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const { mutate: askQuestion, isPending } = useAskQuestion(courseId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || title.trim().length < 3) {
      sToast.error("Title must be at least 3 characters");
      return;
    }
    if (!content.trim() || content.trim().length < 5) {
      sToast.error("Question details must be at least 5 characters");
      return;
    }

    askQuestion(
      { courseId, title: title.trim(), content: content.trim() },
      {
        onSuccess: () => {
          sToast.success("Question posted successfully!");
          setTitle("");
          setContent("");
          onClose();
        },
        onError: (err: unknown) => {
          const error = err as { response?: { data?: { message?: string } } };
          sToast.error(error.response?.data?.message || "Failed to post question");
        },
      }
    );
  };

  return (
    <Dialog
      open={open}
      onClose={isPending ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: { borderRadius: 3, p: 1 },
        },
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ pb: 1, display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              bgcolor: "rgba(86,36,208,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <HelpOutlineIcon sx={{ color: "#5624D0" }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#1c1d1f" }}>
              Ask a Course Question
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Be specific so instructors and classmates can help you effectively.
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, mt: 1 }}>
            <TextField
              label="Question Title or Summary"
              placeholder="e.g., How do I configure state management in chapter 3?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              size="small"
              required
              disabled={isPending}
            />

            <TextField
              label="Details & What you tried"
              placeholder="Provide background, error messages, or steps you've already attempted..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              multiline
              rows={4}
              fullWidth
              required
              disabled={isPending}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2, pt: 1 }}>
          <Button
            onClick={onClose}
            disabled={isPending}
            sx={{ textTransform: "none", color: "text.secondary", fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isPending}
            sx={{
              bgcolor: "#5624D0",
              textTransform: "none",
              fontWeight: 700,
              px: 3,
              "&:hover": { bgcolor: "#461da8" },
            }}
          >
            {isPending ? "Posting..." : "Post Question"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
