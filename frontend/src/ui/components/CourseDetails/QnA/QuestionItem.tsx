"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Stack,
  Button,
  IconButton,
  TextField,
  Chip,
  Divider,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutlined";
import VerifiedIcon from "@mui/icons-material/Verified";
import SendIcon from "@mui/icons-material/Send";
import { IQnAQuestion } from "@/typescript/interface/qna.interface";
import { useReplyQuestion, useDeleteQuestion } from "@/hooks/react-query/useQnA";
import { getImageUrl } from "@/utils/getImageUrl";
import { sToast } from "@/components/ui/alert/stoast";

interface QuestionItemProps {
  question: IQnAQuestion;
  courseId: string;
  currentUserId?: string;
  isInstructor?: boolean;
}

export default function QuestionItem({
  question,
  courseId,
  currentUserId,
  isInstructor,
}: QuestionItemProps) {
  const [showReplies, setShowReplies] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");

  const { mutate: postReply, isPending: isReplying } = useReplyQuestion(courseId);
  const { mutate: deleteQuestion, isPending: isDeleting } = useDeleteQuestion(courseId);

  const isAuthor = Boolean(currentUserId && question.user?._id === currentUserId);
  const canDelete = isAuthor || isInstructor;

  const dateStr = new Date(question.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim()) return;

    postReply(
      { questionId: question._id, message: replyMessage.trim() },
      {
        onSuccess: () => {
          sToast.success("Reply posted!");
          setReplyMessage("");
          setShowReplies(true);
        },
        onError: (err: unknown) => {
          const error = err as { response?: { data?: { message?: string } } };
          sToast.error(error.response?.data?.message || "Failed to post reply");
        },
      }
    );
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this question?")) {
      deleteQuestion(question._id, {
        onSuccess: () => sToast.info("Question deleted"),
        onError: () => sToast.error("Failed to delete question"),
      });
    }
  };

  return (
    <Box
      sx={{
        p: 2.5,
        borderRadius: 2.5,
        border: "1px solid",
        borderColor: "grey.200",
        bgcolor: "#ffffff",
        transition: "box-shadow 0.2s",
        "&:hover": { boxShadow: "0 2px 8px rgba(0,0,0,0.04)" },
      }}
    >
      {/* Author Header */}
      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 1.5 }}>
        <Avatar
          src={question.user?.profilePicture ? getImageUrl(question.user.profilePicture) : undefined}
          sx={{ width: 38, height: 38, bgcolor: "#5624D0", fontSize: "0.85rem", fontWeight: 700 }}
        >
          {question.user?.name?.[0]?.toUpperCase() || "S"}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#1c1d1f" }}>
            {question.user?.name || "Student"}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Asked on {dateStr}
          </Typography>
        </Box>
        {canDelete && (
          <IconButton size="small" onClick={handleDelete} disabled={isDeleting} sx={{ color: "text.disabled" }}>
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        )}
      </Stack>

      {/* Question Details */}
      <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#1c1d1f", mb: 0.5 }}>
        {question.title}
      </Typography>
      <Typography variant="body2" sx={{ color: "#4b5563", lineHeight: 1.6, whiteSpace: "pre-wrap", mb: 2 }}>
        {question.content}
      </Typography>

      {/* Replies Toggle */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Button
          size="small"
          startIcon={<ChatBubbleOutlineIcon fontSize="small" />}
          onClick={() => setShowReplies(!showReplies)}
          sx={{ textTransform: "none", fontWeight: 700, color: "#5624D0" }}
        >
          {question.answers?.length || 0} {question.answers?.length === 1 ? "Answer" : "Answers"}
        </Button>
      </Box>

      {/* Collapsible Answers Section */}
      {showReplies && (
        <Box sx={{ mt: 2, pt: 2, borderTop: "1px solid", borderColor: "grey.100" }}>
          <Stack spacing={2} sx={{ mb: 2.5 }}>
            {question.answers?.length === 0 ? (
              <Typography variant="caption" color="text.secondary" sx={{ fontStyle: "italic" }}>
                No answers yet. Share your knowledge or wait for the instructor response.
              </Typography>
            ) : (
              question.answers.map((ans, idx) => (
                <Box
                  key={ans._id || idx}
                  sx={{
                    p: 1.75,
                    borderRadius: 2,
                    bgcolor: ans.isInstructor ? "rgba(86,36,208,0.04)" : "grey.50",
                    border: "1px solid",
                    borderColor: ans.isInstructor ? "rgba(86,36,208,0.2)" : "grey.200",
                  }}
                >
                  <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 0.75 }}>
                    <Avatar
                      src={ans.user?.profilePicture ? getImageUrl(ans.user.profilePicture) : undefined}
                      sx={{ width: 28, height: 28, fontSize: "0.75rem", bgcolor: ans.isInstructor ? "#5624D0" : "grey.400" }}
                    >
                      {ans.user?.name?.[0]?.toUpperCase() || "U"}
                    </Avatar>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: "#1c1d1f" }}>
                      {ans.user?.name || "Participant"}
                    </Typography>
                    {ans.isInstructor && (
                      <Chip
                        icon={<VerifiedIcon sx={{ fontSize: "14px !important" }} />}
                        label="Instructor"
                        size="small"
                        color="secondary"
                        sx={{ height: 20, fontSize: "0.68rem", fontWeight: 700 }}
                      />
                    )}
                  </Stack>
                  <Typography variant="body2" sx={{ color: "#374151", pl: 4.5, whiteSpace: "pre-wrap" }}>
                    {ans.message}
                  </Typography>
                </Box>
              ))
            )}
          </Stack>

          {/* Quick Reply Form */}
          <form onSubmit={handleReplySubmit}>
            <Stack direction="row" spacing={1}>
              <TextField
                placeholder="Write an answer or follow-up..."
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                size="small"
                fullWidth
                disabled={isReplying}
              />
              <Button
                type="submit"
                variant="contained"
                disabled={isReplying || !replyMessage.trim()}
                sx={{ bgcolor: "#5624D0", textTransform: "none", px: 2.5, fontWeight: 700 }}
              >
                <SendIcon fontSize="small" />
              </Button>
            </Stack>
          </form>
        </Box>
      )}
    </Box>
  );
}
