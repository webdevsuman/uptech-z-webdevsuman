"use client";

import { useQuery } from "@tanstack/react-query";
import { CourseQueryEnum } from "./hook-keys/allProject.keys";
import { endpoints } from "@/api/endpoints";
import api from "@/api/apiClient";
import { ICourse } from "@/typescript/interface/course.interface";

export interface FeaturedCoursesApiResponse {
  success: boolean;
  data: ICourse[];
}

export const useFeaturedCourses = (limit: number = 10) => {
  return useQuery<ICourse[]>({
    queryKey: [CourseQueryEnum.FeaturedCourses, limit],
    queryFn: async () => {
      const url = `${endpoints.courses.featured}?limit=${limit}`;
      const response = await api.get<FeaturedCoursesApiResponse>(url);
      return response.data ?? [];
    },
  });
};
