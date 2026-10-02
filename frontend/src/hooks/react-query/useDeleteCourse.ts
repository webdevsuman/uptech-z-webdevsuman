"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { endpoints } from "@/api/endpoints";
import api from "@/api/apiClient";
import { CourseQueryEnum } from "./hook-keys/allProject.keys";

export interface DeleteCourseApiResponse {
  success: boolean;
  message: string;
}

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteCourseApiResponse, Error, string>({
    mutationFn: async (courseId: string) => {
      const response = await api.delete<DeleteCourseApiResponse>(
        endpoints.courses.delete(courseId)
      );
      return response;
    },
    onSuccess: (_data, courseId) => {
      queryClient.removeQueries({
        queryKey: [CourseQueryEnum.CourseDetails, courseId],
      });
      queryClient.invalidateQueries({
        queryKey: [CourseQueryEnum.Courses],
      });
    },
  });
};
