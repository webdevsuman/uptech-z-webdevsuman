"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Box, Stack, Typography, Button, Chip, CircularProgress } from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Visibility as VisibilityIcon,
  DeleteOutlined as DeleteIcon,
} from "@mui/icons-material";
import { ICourse } from "@/typescript/interface/course.interface";
import { useDeleteCourse } from "@/hooks/react-query/useDeleteCourse";
import { DeleteCourseModal } from "./DeleteCourseModal";
import { sToast } from "@/components/ui/alert/stoast";

interface CourseManageHeaderProps {
  course: ICourse;
  isSaving: boolean;
  onSave: () => void;
  isDirty?: boolean;
}

export const CourseManageHeader: React.FC<CourseManageHeaderProps> = ({
  course,
  isSaving,
  onSave,
  isDirty = false,
}) => {
  const router = useRouter();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const { mutateAsync: deleteCourse, isPending: isDeleting } = useDeleteCourse();

  const isDraft = !course.status || course.status === "draft";

  const handleDelete = async () => {
    try {
      await deleteCourse(course._id || course.id || "");
      sToast.success(isDraft ? "Draft discarded successfully" : "Course deleted successfully");
      router.push("/instructor/courses");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to delete course";
      sToast.error(message);
    }
  };
  const getStatusChip = (status?: string) => {
    switch (status) {
      case "published":
        return (
          <Chip
            size="small"
            label="Live"
            sx={{
              bgcolor: "rgba(46, 125, 50, 0.12)",
              color: "#2e7d32",
              fontWeight: 600,
              fontSize: "0.75rem",
              borderRadius: 1,
            }}
          />
        );
      case "under_review":
        return (
          <Chip
            size="small"
            label="Under Review"
            sx={{
              bgcolor: "rgba(2, 136, 209, 0.12)",
              color: "#0288d1",
              fontWeight: 600,
              fontSize: "0.75rem",
              borderRadius: 1,
            }}
          />
        );
      default:
        return (
          <Chip
            size="small"
            label="Draft"
            sx={{
              bgcolor: "rgba(100, 116, 139, 0.12)",
              color: "text.secondary",
              fontWeight: 600,
              fontSize: "0.75rem",
              borderRadius: 1,
            }}
          />
        );
    }
  };

  return (
    <Box
      sx={{
        pb: 2,
        mb: 3,
        borderBottom: "1px solid",
        borderColor: "divider",
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "flex-start", sm: "center" },
        justifyContent: "space-between",
        gap: 2,
      }}
    >
      {/* Left: Back & Course Title */}
      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", minWidth: 0 }}>
        <Button
          component={Link}
          href="/instructor/courses"
          color="inherit"
          size="small"
          startIcon={<ArrowBackIcon sx={{ fontSize: "1.1rem" }} />}
          sx={{
            minWidth: "auto",
            textTransform: "none",
            color: "text.secondary",
            fontWeight: 600,
            fontSize: "0.85rem",
          }}
        >
          Back to Courses
        </Button>
        <Box sx={{ minWidth: 0 }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <Typography
              variant="subtitle1"
              noWrap
              sx={{ fontWeight: 700, color: "text.primary", maxWidth: { xs: 200, sm: 360 } }}
            >
              {course.title}
            </Typography>
            {getStatusChip(course.status)}
          </Stack>
        </Box>
      </Stack>

      {/* Right: Actions */}
      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
        <Button
          component={Link}
          href={`/courses/${course._id || course.id}`}
          target="_blank"
          variant="outlined"
          color="inherit"
          size="small"
          startIcon={<VisibilityIcon sx={{ fontSize: "1rem" }} />}
          sx={{ textTransform: "none", fontWeight: 600, fontSize: "0.8rem", px: 2 }}
        >
          Preview
        </Button>

        <Button
          variant="outlined"
          color="error"
          size="small"
          onClick={() => setDeleteModalOpen(true)}
          startIcon={<DeleteIcon sx={{ fontSize: "1rem" }} />}
          sx={{ textTransform: "none", fontWeight: 600, fontSize: "0.8rem", px: 2 }}
        >
          {isDraft ? "Discard Draft" : "Delete Course"}
        </Button>
      </Stack>

      {/* Delete / Discard Confirmation Dialog */}
      <DeleteCourseModal
        open={deleteModalOpen}
        courseTitle={course.title}
        isDeleting={isDeleting}
        isDraft={isDraft}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />
    </Box>
  );
};
