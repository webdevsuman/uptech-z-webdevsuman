"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { endpoints } from "@/api/endpoints";
import api from "@/api/apiClient";
import {
  ICourseReviewsData,
  IReviewEligibility,
} from "@/typescript/interface/review.interface";
import {
  ReviewQueryEnum,
  CourseQueryEnum,
} from "./hook-keys/allProject.keys";

interface ReviewsApiResponse {
  success: boolean;
  data: ICourseReviewsData;
}

interface EligibilityApiResponse {
  success: boolean;
  data: IReviewEligibility;
}

interface SubmitReviewPayload {
  courseId: string;
  rating: number;
  comment: string;
}

interface SubmitReviewApiResponse {
  success: boolean;
  message: string;
  data: {
    review: unknown;
    courseStats: {
      rating: number;
      reviewsCount: number;
    };
  };
}

export const useCourseReviews = (courseId: string | undefined) => {
  return useQuery<ICourseReviewsData | null>({
    queryKey: [ReviewQueryEnum.CourseReviews, courseId],
    queryFn: async () => {
      if (!courseId) return null;
      const response = await api.get<ReviewsApiResponse>(
        endpoints.reviews.courseReviews(courseId)
      );
      return response.data ?? null;
    },
    enabled: Boolean(courseId),
  });
};

export const useReviewEligibility = (
  courseId: string | undefined,
  isAuthenticated: boolean
) => {
  return useQuery<IReviewEligibility | null>({
    queryKey: [ReviewQueryEnum.ReviewEligibility, courseId],
    queryFn: async () => {
      if (!courseId || !isAuthenticated) return null;
      const response = await api.get<EligibilityApiResponse>(
        endpoints.reviews.eligibility(courseId)
      );
      return response.data ?? null;
    },
    enabled: Boolean(courseId && isAuthenticated),
  });
};

export const useCreateOrUpdateReview = (courseId: string) => {
  const queryClient = useQueryClient();

  return useMutation<SubmitReviewApiResponse, Error, SubmitReviewPayload>({
    mutationFn: async (payload: SubmitReviewPayload) => {
      return await api.post<SubmitReviewApiResponse>(
        endpoints.reviews.create,
        payload
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ReviewQueryEnum.CourseReviews, courseId],
      });
      queryClient.invalidateQueries({
        queryKey: [ReviewQueryEnum.ReviewEligibility, courseId],
      });
      queryClient.invalidateQueries({
        queryKey: [ReviewQueryEnum.MyReviews],
      });
      queryClient.invalidateQueries({
        queryKey: [CourseQueryEnum.CourseDetails, courseId],
      });
    },
  });
};

export interface IMyReviewCourse {
  _id: string;
  title: string;
  thumbnail?: string;
  price?: number;
  rating?: number;
}

export interface IMyReview {
  _id: string;
  student: string;
  course: IMyReviewCourse;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

interface MyReviewsApiResponse {
  success: boolean;
  data: IMyReview[];
}

export const useMyReviews = () => {
  return useQuery<IMyReview[]>({
    queryKey: [ReviewQueryEnum.MyReviews],
    queryFn: async () => {
      const response = await api.get<MyReviewsApiResponse>(endpoints.reviews.my);
      return response.data ?? [];
    },
  });
};
