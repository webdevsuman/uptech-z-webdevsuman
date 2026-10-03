"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { endpoints } from "@/api/endpoints";
import api from "@/api/apiClient";
import {
  EnrollmentQueryEnum,
  CourseQueryEnum,
  ReviewQueryEnum,
} from "./hook-keys/allProject.keys";

export interface CreateCheckoutSessionPayload {
  courseId: string;
}

export interface CreateCheckoutSessionResponse {
  success: boolean;
  message?: string;
  isFree?: boolean;
  url?: string;
  sessionId?: string;
}

export interface VerifyPaymentSessionPayload {
  sessionId: string;
}

export interface VerifyPaymentSessionResponse {
  success: boolean;
  message: string;
  data: unknown;
}

export const useCreateCheckoutSession = () => {
  return useMutation<
    CreateCheckoutSessionResponse,
    Error,
    CreateCheckoutSessionPayload
  >({
    mutationFn: async (payload: CreateCheckoutSessionPayload) => {
      return await api.post<CreateCheckoutSessionResponse>(
        endpoints.payments.createCheckoutSession,
        payload
      );
    },
  });
};

export const useVerifyPaymentSession = (courseId?: string) => {
  const queryClient = useQueryClient();

  return useMutation<
    VerifyPaymentSessionResponse,
    Error,
    VerifyPaymentSessionPayload
  >({
    mutationFn: async (payload: VerifyPaymentSessionPayload) => {
      return await api.post<VerifyPaymentSessionResponse>(
        endpoints.payments.verifySession,
        payload
      );
    },
    onSuccess: () => {
      if (courseId) {
        queryClient.invalidateQueries({
          queryKey: [EnrollmentQueryEnum.EnrollmentStatus, courseId],
        });
        queryClient.invalidateQueries({
          queryKey: [CourseQueryEnum.CourseDetails, courseId],
        });
        queryClient.invalidateQueries({
          queryKey: [ReviewQueryEnum.ReviewEligibility, courseId],
        });
      }
      queryClient.invalidateQueries({
        queryKey: [EnrollmentQueryEnum.MyEnrollments],
      });
    },
  });
};
