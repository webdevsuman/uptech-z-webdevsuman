"use client";
//Swiper.js
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Typography } from "@mui/material";
import { useCourses } from "@/hooks/react-query/useCourses";
import CategoryCourseCard from "./CategoryCourseCard";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { CourseFilters } from "@/typescript/interface/course.interface";
import Link from "next/link";

export default function CourseList({ filters }: { filters: CourseFilters }) {
  const { data: courses, isLoading, isError } = useCourses(filters);

  // console.log(courses);

  if (isLoading) return <Typography>Loading courses...</Typography>;
  if (isError) return <Typography>Error loading courses</Typography>;

  if (!courses || courses.length === 0) {
    return (
      <Typography className="text-center border-2 py-5" variant="h4">
        Sorry, No courses found for this category or search.
      </Typography>
    );
  }

  return (
    <>
      <Typography variant="h5" className="text-center underline">
        <strong>Current Courses</strong>
      </Typography>
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={20}
        slidesPerView={3} // Show 3 per view
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          320: { slidesPerView: 1 }, // Mobile
          640: { slidesPerView: 2 }, // Tablet
          1024: { slidesPerView: 3 }, // Desktop
        }}
      >
        {courses.map((course) => {
          const courseId = course._id || course.id;
          return (
            <SwiperSlide key={courseId}>
              <Link href={`/courses/${courseId}`}>
                <CategoryCourseCard course={course} />
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </>
  );
}
