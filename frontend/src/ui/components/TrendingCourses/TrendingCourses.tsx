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

export default function TrendingCourses() {
  const { data: trending, isLoading, isError } = useTrendingCourses();

  if (isLoading) return <CircularProgress />;
  if (isError)
    return (
      <Typography color="error">Failed to load trending courses.</Typography>
    );

  return (
    <Container maxWidth="lg" className="!my-20">
      <TitleSubheading
        title="Trending courses"
        subheading="Learners are viewing these courses more"
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
        {trending?.map((course) => (
          <SwiperSlide key={course.id}>
            <Link href={`/courses/${course.id}`}>
              <CourseCard
                title={course.title}
                instructor={course.instructor}
                // image_path={course.image_path}
                image_path={getImageUrl(course.image_path)} // ✅ get URL dynamically
                rating={course.rating}
                price={course.price}
              />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </Container>
  );
}
