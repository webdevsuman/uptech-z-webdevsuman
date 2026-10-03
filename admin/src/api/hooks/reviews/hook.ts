"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { endpoints } from "@/api/endpoints";
import { api } from "@/api/apiClient";
import { ReviewEnum } from "./key";
import {
  TReviewListResponse,
  TReviewPayload,
  TReviewResponse,
} from "./schema";

export interface UseReviewsListParams {
  search?: string;
  rating?: string;
  courseId?: string;
}

export const useReviewsList = (params?: UseReviewsListParams) => {
  return useQuery({
    queryKey: [ReviewEnum.list, params],
    queryFn: () =>
      api.get<TReviewListResponse>(endpoints.reviews.list, {
        params: {
          search: params?.search || undefined,
          rating: params?.rating || undefined,
          courseId: params?.courseId || undefined,
        },
      }),
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [ReviewEnum.delete],
    mutationFn: ({ id }: TReviewPayload["delete"]) =>
      api.delete<TReviewResponse["delete"]>(endpoints.reviews.details(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ReviewEnum.list] });
    },
  });
};
