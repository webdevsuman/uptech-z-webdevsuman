"use client";

import { useQuery } from "@tanstack/react-query";
import { endpoints } from "@/api/endpoints";
import api from "@/api/apiClient";
import { ICourse } from "@/typescript/interface/course.interface";
import { CourseQueryEnum } from "./hook-keys/allProject.keys";

export interface SingleCourseApiResponse {
  success: boolean;
  data: ICourse;
}

export const useCourse = (id: string | undefined) => {
  return useQuery<ICourse | null>({
    queryKey: [CourseQueryEnum.CourseDetails, id],
    queryFn: async () => {
      if (!id) return null;
      const response = await api.get<SingleCourseApiResponse>(
        endpoints.courses.details(id)
      );
      return response.data ?? null;
    },
    enabled: Boolean(id),
  });
};
