"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Box,
  Stack,
  Typography,
  Button,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  CircularProgress,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  MenuBook as MenuBookIcon,
  Edit as EditIcon,
  DeleteOutlined as DeleteIcon,
} from "@mui/icons-material";
import { useInstructorCourses } from "@/hooks/react-query/useInstructorCourses";
import { useDeleteCourse } from "@/hooks/react-query/useDeleteCourse";
import { DeleteCourseModal } from "@/module/instructor/course-manage/components/DeleteCourseModal";
import { sToast } from "@/components/ui/alert/stoast";
import { ICourse } from "@/typescript/interface/course.interface";

export default function InstructorCoursesPage() {
  const { data: courses, isLoading, isError } = useInstructorCourses();
  const [search, setSearch] = useState("");
  const [courseToDelete, setCourseToDelete] = useState<ICourse | null>(null);
  const { mutateAsync: deleteCourse, isPending: isDeleting } = useDeleteCourse();

  const handleDeleteConfirm = async () => {
    if (!courseToDelete) return;
    try {
      await deleteCourse(courseToDelete._id || courseToDelete.id || "");
      sToast.success("Course deleted successfully");
      setCourseToDelete(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to delete course";
      sToast.error(message);
    }
  };

  const filteredCourses = (courses || []).filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusChip = (status: string) => {
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
    <Stack spacing={3} sx={{ width: "100%" }}>
      {/* Top Action Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        sx={{
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
        }}
        spacing={2}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: "text.primary" }}
          >
            My Courses
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Create, manage, and edit your course curricula and content
          </Typography>
        </Box>
        <Button
          component={Link}
          href="/instructor/courses/create"
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          sx={{ fontWeight: 600, textTransform: "none", px: 2.5 }}
        >
          New Course
        </Button>
      </Stack>

      {/* Search Filter */}
      <Box sx={{ maxWidth: 360 }}>
        <TextField
          size="small"
          fullWidth
          placeholder="Filter courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: "1.1rem", color: "text.secondary" }} />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      {/* Courses Table / Empty State */}
      <Paper
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : isError ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography color="error" variant="body1">
              Failed to load courses. Please try again.
            </Typography>
          </Box>
        ) : filteredCourses.length === 0 ? (
          <Box sx={{ py: 8, px: 3, textAlign: "center" }}>
            <MenuBookIcon sx={{ fontSize: 48, color: "text.disabled", mb: 1.5 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
              No courses found
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", maxWidth: 400, mx: "auto", mb: 2.5 }}
            >
              Get started by creating your first course and sharing your knowledge
              with students worldwide.
            </Typography>
            <Button
              component={Link}
              href="/instructor/courses/create"
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              sx={{ textTransform: "none", fontWeight: 600 }}
            >
              Create Course
            </Button>
          </Box>
        ) : (
          <TableContainer>
            <Table size="medium">
              <TableHead>
                <TableRow sx={{ bgcolor: "action.hover" }}>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.85rem" }}>
                    Course Title
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.85rem" }}>
                    Category
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.85rem" }}>
                    Price
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: "0.85rem" }}>
                    Status
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, fontSize: "0.85rem" }}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCourses.map((course: ICourse) => {
                  const categoryName =
                    typeof course.category === "object" && course.category !== null
                      ? course.category.name
                      : "General";

                  return (
                    <TableRow key={course._id || course.id} hover>
                      <TableCell sx={{ maxWidth: 300 }}>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600, color: "text.primary" }}
                          noWrap
                        >
                          {course.title}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "text.secondary" }}>
                          Updated {course.updatedAt ? new Date(course.updatedAt).toLocaleDateString() : "recently"}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ color: "text.secondary", fontSize: "0.875rem" }}>
                        {categoryName}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
                        {course.price === 0 ? "Free" : `₹${course.price}`}
                      </TableCell>
                      <TableCell>{getStatusChip(course.status)}</TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} sx={{ justifyContent: "flex-end", alignItems: "center" }}>
                          <Button
                            size="small"
                            variant="outlined"
                            color="primary"
                            startIcon={<EditIcon sx={{ fontSize: "0.95rem" }} />}
                            component={Link}
                            href={`/instructor/courses/${course._id || course.id}/manage`}
                            sx={{ textTransform: "none", fontWeight: 600, fontSize: "0.75rem" }}
                          >
                            Manage
                          </Button>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => setCourseToDelete(course)}
                            title="Delete course"
                            sx={{
                              border: "1px solid",
                              borderColor: "error.light",
                              borderRadius: 1,
                              p: 0.5,
                            }}
                          >
                            <DeleteIcon sx={{ fontSize: "1.1rem" }} />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Delete Confirmation Modal */}
      <DeleteCourseModal
        open={Boolean(courseToDelete)}
        courseTitle={courseToDelete?.title || ""}
        isDeleting={isDeleting}
        isDraft={courseToDelete?.status === "draft"}
        onClose={() => setCourseToDelete(null)}
        onConfirm={handleDeleteConfirm}
      />
    </Stack>
  );
}
