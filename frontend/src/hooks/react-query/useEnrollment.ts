"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { endpoints } from "@/api/endpoints";
import api from "@/api/apiClient";
import { IEnrollmentStatus } from "@/typescript/interface/review.interface";
import {
  EnrollmentQueryEnum,
  ReviewQueryEnum,
  CourseQueryEnum,
} from "./hook-keys/allProject.keys";

interface EnrollmentStatusApiResponse {
  success: boolean;
  data: IEnrollmentStatus;
}

interface EnrollCoursePayload {
  courseId: string;
}

interface EnrollApiResponse {
  success: boolean;
  message: string;
  data: unknown;
}

export const useEnrollmentStatus = (
  courseId: string | undefined,
  isAuthenticated: boolean
) => {
  return useQuery<IEnrollmentStatus | null>({
    queryKey: [EnrollmentQueryEnum.EnrollmentStatus, courseId],
    queryFn: async () => {
      if (!courseId || !isAuthenticated) return null;
      const response = await api.get<EnrollmentStatusApiResponse>(
        endpoints.enrollments.status(courseId)
      );
      return response.data ?? null;
    },
    enabled: Boolean(courseId && isAuthenticated),
  });
};

export interface IMyEnrollmentCourse {
  _id: string;
  title: string;
  thumbnail?: string;
  price?: number;
  rating?: number;
  reviewsCount?: number;
}

export interface IMyEnrollment {
  _id: string;
  student: string;
  course: IMyEnrollmentCourse;
  pricePaid: number;
  createdAt: string;
  updatedAt: string;
}

interface MyEnrollmentsApiResponse {
  success: boolean;
  data: IMyEnrollment[];
}

export const useMyEnrollments = () => {
  return useQuery<IMyEnrollment[]>({
    queryKey: [EnrollmentQueryEnum.MyEnrollments],
    queryFn: async () => {
      const response = await api.get<MyEnrollmentsApiResponse>(
        endpoints.enrollments.my
      );
      return response.data ?? [];
    },
  });
};

export const useEnrollCourse = (courseId: string) => {
  const queryClient = useQueryClient();

  return useMutation<EnrollApiResponse, Error, EnrollCoursePayload>({
    mutationFn: async (payload: EnrollCoursePayload) => {
      return await api.post<EnrollApiResponse>(
        endpoints.enrollments.enroll,
        payload
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [EnrollmentQueryEnum.EnrollmentStatus, courseId],
      });
      queryClient.invalidateQueries({
        queryKey: [EnrollmentQueryEnum.MyEnrollments],
      });
      queryClient.invalidateQueries({
        queryKey: [ReviewQueryEnum.ReviewEligibility, courseId],
      });
      queryClient.invalidateQueries({
        queryKey: [CourseQueryEnum.CourseDetails, courseId],
      });
    },
  });
};
