"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { endpoints } from "@/api/endpoints";
import api from "@/api/apiClient";
import { ICourse } from "@/typescript/interface/course.interface";
import { CourseQueryEnum } from "./hook-keys/allProject.keys";

export interface UpdateCourseApiResponse {
  success: boolean;
  message: string;
  data: ICourse;
}

export const useUpdateCourse = (courseId: string) => {
  const queryClient = useQueryClient();

  return useMutation<UpdateCourseApiResponse, Error, FormData | Record<string, unknown>>({
    mutationFn: async (payload: FormData | Record<string, unknown>) => {
      const isFormData = typeof FormData !== "undefined" && payload instanceof FormData;
      const config = isFormData
        ? { headers: { "Content-Type": "multipart/form-data" } }
        : undefined;

      const response = await api.patch<UpdateCourseApiResponse>(
        endpoints.courses.update(courseId),
        payload,
        config
      );
      return response;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(
        [CourseQueryEnum.CourseDetails, courseId],
        data.data
      );
      queryClient.invalidateQueries({
        queryKey: [CourseQueryEnum.CourseDetails, courseId],
      });
      queryClient.invalidateQueries({
        queryKey: [CourseQueryEnum.Courses],
      });
    },
  });
};
