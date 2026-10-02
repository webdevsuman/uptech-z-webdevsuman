"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { endpoints } from "@/api/endpoints";
import { api } from "@/api/apiClient";
import { CategoryEnum } from "./key";
import {
  ICategoryItem,
  TCategoryListResponse,
  TCategoryPayload,
  TCategoryResponse,
} from "./schema";

export const useCategoriesList = () => {
  return useQuery({
    queryKey: [CategoryEnum.list],
    queryFn: () => api.get<TCategoryListResponse>(endpoints.categories.list),
  });
};

export const useCategoryDetails = (id: string) => {
  return useQuery({
    queryKey: [CategoryEnum.details, id],
    queryFn: () =>
      api.get<TCategoryResponse["details"]>(endpoints.categories.details(id)),
    enabled: Boolean(id),
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [CategoryEnum.create],
    mutationFn: (payload: TCategoryPayload["create"]) =>
      api.post<TCategoryResponse["create"]>(endpoints.categories.list, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CategoryEnum.list] });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [CategoryEnum.update],
    mutationFn: ({ id, ...payload }: TCategoryPayload["update"]) =>
      api.patch<TCategoryResponse["update"]>(
        endpoints.categories.details(id),
        payload
      ),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [CategoryEnum.list] });
      queryClient.invalidateQueries({
        queryKey: [CategoryEnum.details, variables.id],
      });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [CategoryEnum.delete],
    mutationFn: ({ id }: TCategoryPayload["delete"]) =>
      api.delete<TCategoryResponse["delete"]>(endpoints.categories.details(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CategoryEnum.list] });
    },
  });
};
