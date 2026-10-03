"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Avatar,
  Box,
  Chip,
  Button,
  TextField,
  IconButton,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutlined";
import VerifiedIcon from "@mui/icons-material/Verified";
import SendIcon from "@mui/icons-material/Send";
import { IQnAQuestion } from "@/typescript/interface/qna.interface";
import { useReplyQuestion, useDeleteQuestion } from "@/hooks/react-query/useQnA";
import { getImageUrl } from "@/utils/getImageUrl";
import { sToast } from "@/components/ui/alert/stoast";

interface InstructorQnACardProps {
  question: IQnAQuestion;
}

export const InstructorQnACard: React.FC<InstructorQnACardProps> = ({ question }) => {
  const [showReplies, setShowReplies] = useState(true);
  const [replyMessage, setReplyMessage] = useState("");

  const courseId =
    typeof question.course === "object" && question.course !== null
      ? question.course._id
      : (question.course as string);
  const courseTitle =
    typeof question.course === "object" && question.course !== null
      ? question.course.title
      : "Course";

  const { mutate: postReply, isPending: isReplying } = useReplyQuestion(courseId);
  const { mutate: deleteQuestion, isPending: isDeleting } = useDeleteQuestion(courseId);

  const hasInstructorReply = question.answers?.some((a) => a.isInstructor);
  const isUnanswered = !question.answers?.length || !hasInstructorReply;

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
          sToast.success("Instructor response posted!");
          setReplyMessage("");
        },
        onError: (err: unknown) => {
          const error = err as { response?: { data?: { message?: string } } };
          sToast.error(error.response?.data?.message || "Failed to post answer");
        },
      }
    );
  };

  const handleDelete = () => {
    if (confirm("Delete this student question?")) {
      deleteQuestion(question._id, {
        onSuccess: () => sToast.info("Question deleted"),
        onError: () => sToast.error("Failed to delete question"),
      });
    }
  };

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 2.5,
        border: "1px solid",
        borderColor: isUnanswered ? "warning.main" : "divider",
        bgcolor: "background.paper",
      }}
    >
      <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
        {/* Top Header: Course & Status */}
        <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Chip
            label={courseTitle}
            size="small"
            component={Link}
            href={`/instructor/courses/${courseId}`}
            clickable
            sx={{ fontWeight: 600, fontSize: "0.75rem", bgcolor: "rgba(86,36,208,0.08)", color: "#5624D0" }}
          />

          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <Chip
              size="small"
              label={isUnanswered ? "Needs Instructor Answer" : "Answered"}
              color={isUnanswered ? "warning" : "success"}
              sx={{ fontWeight: 700, fontSize: "0.72rem" }}
            />
            <IconButton size="small" onClick={handleDelete} disabled={isDeleting} sx={{ color: "text.disabled" }}>
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Stack>

        {/* Student Profile & Question Details */}
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 1.5 }}>
          <Avatar
            src={question.user?.profilePicture ? getImageUrl(question.user.profilePicture) : undefined}
            sx={{ width: 36, height: 36, bgcolor: "#5624D0", fontSize: "0.85rem", fontWeight: 700 }}
          >
            {question.user?.name?.[0]?.toUpperCase() || "S"}
          </Avatar>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "text.primary" }}>
              {question.user?.name || "Student"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Asked on {dateStr}
            </Typography>
          </Box>
        </Stack>

        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "text.primary", mb: 0.5 }}>
          {question.title}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6, whiteSpace: "pre-wrap", mb: 2.5 }}>
          {question.content}
        </Typography>

        {/* Replies Section Toggle */}
        <Button
          size="small"
          startIcon={<ChatBubbleOutlineIcon fontSize="small" />}
          onClick={() => setShowReplies(!showReplies)}
          sx={{ textTransform: "none", fontWeight: 700, color: "#5624D0", mb: showReplies ? 2 : 0 }}
        >
          {question.answers?.length || 0} Replies
        </Button>

        {showReplies && (
          <Box sx={{ pt: 2, borderTop: "1px solid", borderColor: "divider" }}>
            {/* Replies List */}
            <Stack spacing={1.5} sx={{ mb: 2 }}>
              {question.answers?.map((ans, idx) => (
                <Box
                  key={ans._id || idx}
                  sx={{
                    p: 1.75,
                    borderRadius: 2,
                    bgcolor: ans.isInstructor ? "rgba(86,36,208,0.05)" : "grey.50",
                    border: "1px solid",
                    borderColor: ans.isInstructor ? "rgba(86,36,208,0.25)" : "divider",
                  }}
                >
                  <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 0.5 }}>
                    <Avatar
                      src={ans.user?.profilePicture ? getImageUrl(ans.user.profilePicture) : undefined}
                      sx={{ width: 26, height: 26, fontSize: "0.75rem", bgcolor: ans.isInstructor ? "#5624D0" : "grey.500" }}
                    >
                      {ans.user?.name?.[0]?.toUpperCase() || "U"}
                    </Avatar>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: "text.primary" }}>
                      {ans.user?.name || "User"}
                    </Typography>
                    {ans.isInstructor && (
                      <Chip
                        icon={<VerifiedIcon sx={{ fontSize: "14px !important" }} />}
                        label="Instructor (You)"
                        size="small"
                        color="secondary"
                        sx={{ height: 20, fontSize: "0.68rem", fontWeight: 700 }}
                      />
                    )}
                  </Stack>
                  <Typography variant="body2" sx={{ color: "text.primary", pl: 4.5, whiteSpace: "pre-wrap" }}>
                    {ans.message}
                  </Typography>
                </Box>
              ))}
            </Stack>

            {/* Answer Input */}
            <form onSubmit={handleReplySubmit}>
              <Stack direction="row" spacing={1}>
                <TextField
                  placeholder="Type your official instructor reply..."
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
                  startIcon={<SendIcon />}
                  sx={{ bgcolor: "#5624D0", textTransform: "none", fontWeight: 700, px: 3, whiteSpace: "nowrap" }}
                >
                  {isReplying ? "Sending..." : "Reply"}
                </Button>
              </Stack>
            </form>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
