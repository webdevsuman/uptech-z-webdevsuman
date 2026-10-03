"use client";

import React, { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  FormHelperText,
  CircularProgress,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useInstructorCourses } from "@/hooks/react-query/useInstructorCourses";
import { useCreateAnnouncement } from "@/hooks/react-query/useAnnouncements";
import {
  createAnnouncementSchema,
  CreateAnnouncementFormData,
} from "../zod/announcement.zod";
import { sToast } from "@/components/ui/alert/stoast";

interface CreateAnnouncementDialogProps {
  open: boolean;
  defaultCourseId?: string;
  onClose: () => void;
}

export const CreateAnnouncementDialog: React.FC<CreateAnnouncementDialogProps> = ({
  open,
  defaultCourseId = "",
  onClose,
}) => {
  const { data: courses, isLoading: isCoursesLoading } = useInstructorCourses();
  const createMutation = useCreateAnnouncement();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CreateAnnouncementFormData>({
    resolver: zodResolver(createAnnouncementSchema),
    defaultValues: {
      courseId: "",
      title: "",
      content: "",
    },
  });

  const titleValue = watch("title") || "";

  useEffect(() => {
    if (open) {
      const fallbackCourseId =
        defaultCourseId ||
        (courses && courses.length > 0
          ? courses[0]._id || courses[0].id || ""
          : "");

      reset({
        courseId: fallbackCourseId,
        title: "",
        content: "",
      });
    }
  }, [open, defaultCourseId, courses, reset]);

  const onSubmit = async (data: CreateAnnouncementFormData) => {
    try {
      await createMutation.mutateAsync({
        courseId: data.courseId,
        title: data.title.trim(),
        content: data.content.trim(),
      });
      sToast.success("Announcement broadcasted successfully!");
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to broadcast announcement";
      sToast.error(msg);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle sx={{ fontWeight: 700 }}>New Course Announcement</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            {/* Target Course Field */}
            <Controller
              name="courseId"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth size="small" error={!!errors.courseId}>
                  <InputLabel id="dialog-course-select-label">Course</InputLabel>
                  <Select
                    {...field}
                    labelId="dialog-course-select-label"
                    label="Course"
                    disabled={isCoursesLoading || createMutation.isPending}
                  >
                    {courses?.map((course) => {
                      const id = course._id || course.id || "";
                      return (
                        <MenuItem key={id} value={id}>
                          {course.title}
                        </MenuItem>
                      );
                    })}
                  </Select>
                  {errors.courseId && (
                    <FormHelperText>{errors.courseId.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />

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
                  placeholder="e.g., Week 3 Office Hours & Project Submissions"
                  error={!!errors.title}
                  helperText={errors.title?.message || `${titleValue.length}/150 characters`}
                  slotProps={{ htmlInput: { maxLength: 150 } }}
                  disabled={createMutation.isPending}
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
                  placeholder="Type your message to students here..."
                  error={!!errors.content}
                  helperText={errors.content?.message}
                  disabled={createMutation.isPending}
                />
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={onClose}
            disabled={createMutation.isPending}
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={createMutation.isPending}
            startIcon={
              createMutation.isPending ? (
                <CircularProgress size={16} color="inherit" />
              ) : null
            }
            sx={{ fontWeight: 700, textTransform: "none" }}
          >
            {createMutation.isPending ? "Posting..." : "Post Announcement"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
