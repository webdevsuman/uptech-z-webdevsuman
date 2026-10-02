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

const sampleCourses: CourseItem[] = [
  {
    id: "c-1",
    title: "Complete Modern Full-Stack Web Development Bootcamp",
    category: "Web Development",
    studentsCount: 642,
    rating: 4.9,
    price: 89.99,
    status: "published",
  },
  {
    id: "c-2",
    title: "Mastering React 19 & Next.js 16 with TypeScript",
    category: "Frontend",
    studentsCount: 385,
    rating: 4.8,
    price: 69.99,
    status: "published",
  },
  {
    id: "c-3",
    title: "Cloud Architecture & Docker Deployment Essentials",
    category: "DevOps & Cloud",
    studentsCount: 154,
    rating: 4.7,
    price: 49.99,
    status: "under_review",
  },
  {
    id: "c-4",
    title: "Advanced Node.js Microservices and System Design",
    category: "Backend",
    studentsCount: 0,
    rating: 0,
    price: 79.99,
    status: "draft",
  },
];

export const InstructorRecentCourses: React.FC = () => {
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
              {sampleCourses.map((course) => (
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
                    ${course.price.toFixed(2)}
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
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};
