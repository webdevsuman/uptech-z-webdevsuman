"use client";

import React from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Button,
  Stack,
  Box,
} from "@mui/material";

interface CourseItem {
  id: string;
  title: string;
  category: string;
  studentsCount: number;
  rating: number;
  price: number;
  status: "published" | "draft" | "under_review";
}

import { useInstructorCourses } from "@/hooks/react-query/useInstructorCourses";
import { ICourse } from "@/typescript/interface/course.interface";

export const InstructorRecentCourses: React.FC = () => {
  const { data: realCourses, isLoading } = useInstructorCourses();

  const coursesToDisplay =
    realCourses && realCourses.length > 0
      ? realCourses.slice(0, 5).map((c: ICourse) => ({
          id: c._id || c.id || "",
          title: c.title,
          category:
            typeof c.category === "object" && c.category !== null
              ? c.category.name
              : "General",
          studentsCount: 0,
          rating: c.rating ?? 0,
          price: c.price ?? 0,
          status: (c.status || "draft") as
            | "published"
            | "draft"
            | "under_review",
        }))
      : [];
  const getStatusChip = (status: CourseItem["status"]) => {
    switch (status) {
      case "published":
        return (
          <Chip
            size="small"
            label="Published"
            color="success"
            variant="outlined"
            sx={{ fontWeight: 600, fontSize: "0.75rem", borderRadius: 1 }}
          />
        );
      case "under_review":
        return (
          <Chip
            size="small"
            label="Under Review"
            color="warning"
            variant="outlined"
            sx={{ fontWeight: 600, fontSize: "0.75rem", borderRadius: 1 }}
          />
        );
      case "draft":
      default:
        return (
          <Chip
            size="small"
            label="Draft"
            variant="outlined"
            sx={{ fontWeight: 600, fontSize: "0.75rem", borderRadius: 1 }}
          />
        );
    }
  };

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack
          direction="row"
          sx={{ alignItems: "center", justifyContent: "space-between", mb: 2 }}
        >
          <Box>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 700, color: "text.primary" }}
            >
              Recent Courses
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Latest created and active courses
            </Typography>
          </Box>
          <Button
            component={Link}
            href="/instructor/courses"
            color="primary"
            sx={{ fontWeight: 600, fontSize: "0.8rem", textTransform: "none" }}
          >
            View All
          </Button>
        </Stack>

        <TableContainer sx={{ overflowX: "auto" }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    color: "text.secondary",
                    fontSize: "0.8rem",
                    py: 1.5,
                  }}
                >
                  Course
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    color: "text.secondary",
                    fontSize: "0.8rem",
                    py: 1.5,
                  }}
                >
                  Category
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    color: "text.secondary",
                    fontSize: "0.8rem",
                    py: 1.5,
                  }}
                >
                  Students
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    color: "text.secondary",
                    fontSize: "0.8rem",
                    py: 1.5,
                  }}
                >
                  Price
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    color: "text.secondary",
                    fontSize: "0.8rem",
                    py: 1.5,
                  }}
                >
                  Status
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    fontWeight: 600,
                    color: "text.secondary",
                    fontSize: "0.8rem",
                    py: 1.5,
                  }}
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    sx={{ textAlign: "center", py: 3, color: "text.secondary" }}
                  >
                    Loading recent courses...
                  </TableCell>
                </TableRow>
              ) : coursesToDisplay.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    sx={{ textAlign: "center", py: 3, color: "text.secondary" }}
                  >
                    No courses created yet. Click &quot;New Course&quot; to get
                    started.
                  </TableCell>
                </TableRow>
              ) : (
                coursesToDisplay.map((course) => (
                  <TableRow
                    key={course.id}
                    hover
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell sx={{ maxWidth: 220, py: 1.5 }}>
                      <Typography
                        variant="body2"
                        noWrap
                        sx={{
                          fontWeight: 600,
                          color: "text.primary",
                          fontSize: "0.875rem",
                        }}
                      >
                        {course.title}
                      </Typography>
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "text.secondary",
                        fontSize: "0.8rem",
                        py: 1.5,
                      }}
                    >
                      {course.category}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 500,
                        color: "text.primary",
                        fontSize: "0.875rem",
                        py: 1.5,
                      }}
                    >
                      {course.studentsCount > 0
                        ? course.studentsCount.toLocaleString()
                        : "—"}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: "text.primary",
                        fontSize: "0.875rem",
                        py: 1.5,
                      }}
                    >
                      ₹{course.price.toFixed(2)}
                    </TableCell>
                    <TableCell sx={{ py: 1.5 }}>
                      {getStatusChip(course.status)}
                    </TableCell>
                    <TableCell align="right" sx={{ py: 1.5 }}>
                      <Button
                        component={Link}
                        href={`/instructor/courses/${course.id}`}
                        variant="text"
                        sx={{
                          minWidth: "auto",
                          fontWeight: 600,
                          fontSize: "0.8rem",
                          textTransform: "none",
                          p: 0.5,
                        }}
                      >
                        Manage
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};
