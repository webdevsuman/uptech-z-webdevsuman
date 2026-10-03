"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  CircularProgress,
  Stack,
  Alert,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/SearchOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import AddCommentOutlinedIcon from "@mui/icons-material/AddCommentOutlined";
import { useAuth } from "@/context/AuthContext";
import { useCourseQuestions } from "@/hooks/react-query/useQnA";
import QuestionItem from "./QuestionItem";
import AskQuestionDialog from "./AskQuestionDialog";
import { useRouter } from "next/navigation";

interface CourseQnAProps {
  courseId: string;
  isEnrolled: boolean;
  isInstructor: boolean;
  onEnroll?: () => void;
}

export default function CourseQnA({
  courseId,
  isEnrolled,
  isInstructor,
  onEnroll,
}: CourseQnAProps) {
  const { user } = useAuth();
  const router = useRouter();
  const isAuthenticated = Boolean(user);
  const hasAccess = isAuthenticated && (isEnrolled || isInstructor);

  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: questions = [], isLoading } = useCourseQuestions(
    courseId,
    search,
    hasAccess
  );

  // If user is not enrolled and not instructor: locked view
  if (!hasAccess) {
    return (
      <Box
        sx={{
          p: 5,
          textAlign: "center",
          borderRadius: 2.5,
          border: "1px dashed",
          borderColor: "grey.300",
          bgcolor: "grey.50",
          my: 2,
        }}
      >
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            bgcolor: "rgba(86,36,208,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 2,
          }}
        >
          <LockOutlinedIcon sx={{ color: "#5624D0", fontSize: 30 }} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 800, color: "#1c1d1f", mb: 1 }}>
          Course Q&A is Reserved for Enrolled Students
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ maxWidth: 460, mx: "auto", mb: 3 }}
        >
          Enroll in this course to unlock full access to questions, peer discussions, and direct answers from the instructor.
        </Typography>
        {isAuthenticated ? (
          <Button
            variant="contained"
            onClick={onEnroll}
            sx={{
              bgcolor: "#5624D0",
              textTransform: "none",
              fontWeight: 700,
              px: 3.5,
              py: 1,
              "&:hover": { bgcolor: "#461da8" },
            }}
          >
            Enroll in Course to Access Q&A
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={() => router.push("/login")}
            sx={{
              bgcolor: "#5624D0",
              textTransform: "none",
              fontWeight: 700,
              px: 3.5,
              py: 1,
              "&:hover": { bgcolor: "#461da8" },
            }}
          >
            Log In to Enroll
          </Button>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 1 }}>
      {/* Search and Ask Question Controls */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ mb: 3, justifyContent: "space-between", alignItems: { sm: "center" } }}
      >
        <TextField
          placeholder="Search course questions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          sx={{ maxWidth: { sm: 380 }, width: "100%" }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
            },
          }}
        />

        <Button
          variant="contained"
          startIcon={<AddCommentOutlinedIcon />}
          onClick={() => setIsDialogOpen(true)}
          sx={{
            bgcolor: "#5624D0",
            textTransform: "none",
            fontWeight: 700,
            px: 2.5,
            py: 0.9,
            "&:hover": { bgcolor: "#461da8" },
          }}
        >
          Ask a Question
        </Button>
      </Stack>

      {/* Loading state */}
      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress size={36} sx={{ color: "#5624D0" }} />
        </Box>
      ) : questions.length === 0 ? (
        <Box
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: 2,
            border: "1px dashed",
            borderColor: "grey.300",
            bgcolor: "grey.50",
          }}
        >
          <Typography variant="body1" sx={{ fontWeight: 700, color: "text.primary" }}>
            {search.trim() ? "No questions match your search" : "No questions asked yet"}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>
            {search.trim()
              ? "Try searching for a different keyword or ask a new question."
              : "Have a question about this course? Be the first to ask!"}
          </Typography>
          <Button
            variant="outlined"
            onClick={() => setIsDialogOpen(true)}
            sx={{ textTransform: "none", fontWeight: 700, borderColor: "#5624D0", color: "#5624D0" }}
          >
            Ask the First Question
          </Button>
        </Box>
      ) : (
        <Stack spacing={2}>
          {questions.map((q) => (
            <QuestionItem
              key={q._id || q.id}
              question={q}
              courseId={courseId}
              currentUserId={user?._id || user?.id}
              isInstructor={isInstructor}
            />
          ))}
        </Stack>
      )}

      {/* Dialog for asking questions */}
      <AskQuestionDialog
        open={isDialogOpen}
        courseId={courseId}
        onClose={() => setIsDialogOpen(false)}
      />
    </Box>
  );
}
