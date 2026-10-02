"use client";

import { useQuery } from "@tanstack/react-query";
import { CourseQueryEnum } from "./hook-keys/allProject.keys";
import { endpoints } from "@/api/endpoints";
import api from "@/api/apiClient";
import { ICourse } from "@/typescript/interface/course.interface";

export interface TrendingCoursesApiResponse {
  success: boolean;
  data: ICourse[];
}

export const useTrendingCourses = (limit: number = 10) => {
  return useQuery<ICourse[]>({
    queryKey: [CourseQueryEnum.TrendingCourses, limit],
    queryFn: async () => {
      const url = `${endpoints.courses.trending}?limit=${limit}`;
      const response = await api.get<TrendingCoursesApiResponse>(url);
      return response.data ?? [];
    },
  });
};
