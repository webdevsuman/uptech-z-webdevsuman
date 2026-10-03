"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { endpoints } from "@/api/endpoints";
import api from "@/api/apiClient";
import { IWishlistStatus } from "@/typescript/interface/review.interface";
import { WishlistQueryEnum } from "./hook-keys/allProject.keys";

interface WishlistStatusApiResponse {
  success: boolean;
  data: IWishlistStatus;
}

interface ToggleWishlistPayload {
  courseId: string;
}

interface ToggleWishlistApiResponse {
  success: boolean;
  message: string;
  data: IWishlistStatus;
}

export const useWishlistStatus = (
  courseId: string | undefined,
  isAuthenticated: boolean
) => {
  return useQuery<IWishlistStatus | null>({
    queryKey: [WishlistQueryEnum.WishlistStatus, courseId],
    queryFn: async () => {
      if (!courseId || !isAuthenticated) return null;
      const response = await api.get<WishlistStatusApiResponse>(
        endpoints.wishlist.status(courseId)
      );
      return response.data ?? null;
    },
    enabled: Boolean(courseId && isAuthenticated),
  });
};

export interface IMyWishlistItem {
  _id: string;
  student: string;
  course: {
    _id: string;
    title: string;
    thumbnail?: string;
    price?: number;
    rating?: number;
    reviewsCount?: number;
    instructor?:
      | {
          _id: string;
          name: string;
        }
      | string;
  };
  createdAt: string;
  updatedAt: string;
}

interface MyWishlistApiResponse {
  success: boolean;
  data: IMyWishlistItem[];
}

export const useMyWishlist = () => {
  return useQuery<IMyWishlistItem[]>({
    queryKey: [WishlistQueryEnum.MyWishlist],
    queryFn: async () => {
      const response = await api.get<MyWishlistApiResponse>(
        endpoints.wishlist.my
      );
      return response.data ?? [];
    },
  });
};

export const useToggleWishlist = (courseId: string) => {
  const queryClient = useQueryClient();

  return useMutation<ToggleWishlistApiResponse, Error, ToggleWishlistPayload>({
    mutationFn: async (payload: ToggleWishlistPayload) => {
      return await api.post<ToggleWishlistApiResponse>(
        endpoints.wishlist.toggle,
        payload
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [WishlistQueryEnum.WishlistStatus, courseId],
      });
      queryClient.invalidateQueries({
        queryKey: [WishlistQueryEnum.MyWishlist],
      });
    },
  });
};
