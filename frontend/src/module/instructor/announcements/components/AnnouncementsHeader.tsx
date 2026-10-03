"use client";

import React from "react";
import {
  Box,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  CircularProgress,
} from "@mui/material";
import { Campaign as CampaignIcon, Add as AddIcon } from "@mui/icons-material";
import { useInstructorCourses } from "@/hooks/react-query/useInstructorCourses";

interface AnnouncementsHeaderProps {
  selectedCourseId: string;
  onSelectCourse: (courseId: string) => void;
  onOpenCreate: () => void;
}

export const AnnouncementsHeader: React.FC<AnnouncementsHeaderProps> = ({
  selectedCourseId,
  onSelectCourse,
  onOpenCreate,
}) => {
  const { data: courses, isLoading } = useInstructorCourses();

  return (
    <Box sx={{ mb: 4 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        sx={{
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          mb: 3,
        }}
        spacing={2}
      >
        <Box>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                bgcolor: "primary.main",
                color: "primary.contrastText",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CampaignIcon fontSize="small" />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                Course Announcements
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Broadcast updates and notices to students enrolled in your
                courses.
              </Typography>
            </Box>
          </Stack>
        </Box>

        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={onOpenCreate}
          sx={{
            fontWeight: 700,
            textTransform: "none",
            borderRadius: 2,
            px: 2.5,
            py: 1,
            boxShadow: 2,
          }}
        >
          New Announcement
        </Button>
      </Stack>

      {/* Filter Bar */}
      <Box
        sx={{
          p: 2,
          bgcolor: "background.paper",
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <FormControl size="small" sx={{ minWidth: 260 }}>
          <InputLabel id="course-filter-label">Filter by Course</InputLabel>
          <Select
            labelId="course-filter-label"
            value={selectedCourseId}
            label="Filter by Course"
            onChange={(e) => onSelectCourse(e.target.value)}
            disabled={isLoading}
          >
            <MenuItem value="">
              <em>All Courses</em>
            </MenuItem>
            {courses?.map((course) => {
              const cId = course._id || course.id || "";
              return (
                <MenuItem key={cId} value={cId}>
                  {course.title}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>

        {isLoading && <CircularProgress size={20} />}
      </Box>
    </Box>
  );
};
