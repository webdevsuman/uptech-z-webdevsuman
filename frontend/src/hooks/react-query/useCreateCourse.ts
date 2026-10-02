"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { endpoints } from "@/api/endpoints";
import api from "@/api/apiClient";
import { ICourse } from "@/typescript/interface/course.interface";
import { CourseQueryEnum } from "./hook-keys/allProject.keys";

export interface CreateCoursePayload {
  title: string;
  category: string;
}

export interface CreateCourseApiResponse {
  success: boolean;
  message: string;
  data: ICourse;
}

export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateCourseApiResponse, Error, CreateCoursePayload>({
    mutationFn: async (payload: CreateCoursePayload) => {
      const response = await api.post<CreateCourseApiResponse>(
        endpoints.courses.create,
        payload
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CourseQueryEnum.Courses],
      });
    },
  });
};
