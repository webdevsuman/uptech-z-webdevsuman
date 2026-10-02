"use client";

import { useQuery } from "@tanstack/react-query";
import { CourseQueryEnum } from "./hook-keys/allProject.keys";
import { endpoints } from "@/api/endpoints";
import api from "@/api/apiClient";
import { ICourse } from "@/typescript/interface/course.interface";
import { CourseFilters } from "@/typescript/interface/course.interface";

export interface CourseApiResponse {
  success: boolean;
  data: ICourse[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const useCourses = (filters?: CourseFilters) => {
  return useQuery<ICourse[]>({
    queryKey: [CourseQueryEnum.Courses, filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters?.search && filters.search.trim()) {
        params.append("search", filters.search.trim());
      }
      if (filters?.categoryId && filters.categoryId !== "All") {
        params.append("category", filters.categoryId);
      } else if (filters?.category && filters.category !== "All") {
        params.append("category", filters.category);
      }
      if (filters?.level && filters.level !== "All") {
        params.append("level", filters.level);
      }
      if (filters?.price && filters.price !== "All") {
        params.append("price", filters.price.toLowerCase());
      }
      if (filters?.sort) {
        params.append("sort", filters.sort);
      }

      const queryString = params.toString();
      const url = queryString
        ? `${endpoints.courses.list}?${queryString}`
        : endpoints.courses.list;

      const response = await api.get<CourseApiResponse>(url);
      return response.data ?? [];
    },
  });
};
