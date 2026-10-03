"use client";

import React from "react";
import Link from "next/link";
import { Box, CircularProgress, Typography } from "@mui/material";
import { TitleSubheading } from "@/ui/components/TitleSubheading";
import CourseCard from "@/ui/CourseCard";
import { useCourses } from "@/hooks/react-query/useCourses";
import { getImageUrl } from "@/utils/getImageUrl";

export default function CourseListPage() {
  const { data: courses = [], isLoading, isError } = useCourses();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center mb-8">
        <TitleSubheading
          title="Courses to get you started"
          subheading="Explore courses from experienced, real-world experts."
        />
      </div>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 12 }}>
          <CircularProgress size={44} sx={{ color: "#5624D0" }} />
        </Box>
      ) : isError ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography color="error" variant="body1">
            Failed to load courses. Please try again later.
          </Typography>
        </Box>
      ) : courses.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography color="text.secondary" variant="body1">
            No published courses found yet. Check back soon!
          </Typography>
        </Box>
      ) : (
        <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 justify-center">
          {courses.map((course) => {
            const courseId = course._id || course.id;
            const instructorName =
              typeof course.instructor === "object" && course.instructor !== null
                ? course.instructor.name
                : typeof course.instructor === "string"
                ? course.instructor
                : "Expert Instructor";

            const resolvedImage = getImageUrl(course.thumbnail || course.image_path);

            return (
              <Link
                key={courseId}
                href={`/courses/${courseId}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <CourseCard
                  title={course.title}
                  instructor={instructorName}
                  image_path={resolvedImage}
                  rating={course.rating ?? 0}
                  price={course.price ?? 0}
                  istrending={course.isTrending}
                  isfeatured={course.isFeatured}
                />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
