"use client";

import { Container, Typography, CircularProgress } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
// import { getImageUrl } from "@/utils/getImageUrl";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import CourseCard from "@/ui/CourseCard";
import { useTrendingCourses } from "@/hooks/react-query/useTrendingCourses";
import { TitleSubheading } from "../TitleSubheading";
import Link from "next/link";
import { getImageUrl } from "@/utils/getImageUrl";
import { ICourse } from "@/typescript/interface/course.interface";

interface TrendingCoursesProps {
  title?: string;
  description?: string;
}

export default function TrendingCourses({
  title = "Trending courses",
  description = "Learners are viewing these courses more",
}: TrendingCoursesProps) {
  const { data: trending, isLoading, isError } = useTrendingCourses();

  if (isLoading) return <CircularProgress />;
  if (isError)
    return (
      <Typography color="error">Failed to load trending courses.</Typography>
    );

  if (!trending || trending.length === 0) {
    return null;
  }

  return (
    <Container maxWidth="lg" className="my-20!">
      <TitleSubheading
        title={title}
        subheading={description}
      />

      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={20}
        slidesPerView={3}
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          320: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {trending.map((course:ICourse) => {
          const courseId = course._id || course.id;
          const instructorName =
            typeof course.instructor === "object" && course.instructor !== null
              ? course.instructor.name
              : typeof course.instructor === "string"
              ? course.instructor
              : "Expert Instructor";

          return (
            <SwiperSlide key={courseId}>
              <Link href={`/courses/${courseId}`}>
                <CourseCard
                  title={course.title}
                  instructor={instructorName}
                  image_path={getImageUrl(course.thumbnail || course.image_path)}
                  rating={course.rating ?? 4.5}
                  price={course.price ?? 0}
                  isfeatured={course.isFeatured}
                  istrending={true}
                />
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </Container>
  );
}
