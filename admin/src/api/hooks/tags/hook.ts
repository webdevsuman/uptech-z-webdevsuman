"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { endpoints } from "@/api/endpoints";
import { api } from "@/api/apiClient";
import { TagEnum } from "./key";
import {
  ITagItem,
  TTagListResponse,
  TTagPayload,
  TTagResponse,
} from "./schema";

export const useTagsList = () => {
  return useQuery({
    queryKey: [TagEnum.list],
    queryFn: () => api.get<TTagListResponse>(endpoints.tags.list),
  });
};

export const useTagDetails = (id: string) => {
  return useQuery({
    queryKey: [TagEnum.details, id],
    queryFn: () =>
      api.get<TTagResponse["details"]>(endpoints.tags.details(id)),
    enabled: Boolean(id),
  });
};

export const useCreateTag = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [TagEnum.create],
    mutationFn: (payload: TTagPayload["create"]) =>
      api.post<TTagResponse["create"]>(endpoints.tags.list, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TagEnum.list] });
    },
  });
};

export const useUpdateTag = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [TagEnum.update],
    mutationFn: ({ id, ...payload }: TTagPayload["update"]) =>
      api.patch<TTagResponse["update"]>(endpoints.tags.details(id), payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [TagEnum.list] });
      queryClient.invalidateQueries({
        queryKey: [TagEnum.details, variables.id],
      });
    },
  });
};

export const useDeleteTag = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [TagEnum.delete],
    mutationFn: ({ id }: TTagPayload["delete"]) =>
      api.delete<TTagResponse["delete"]>(endpoints.tags.details(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TagEnum.list] });
    },
  });
};
