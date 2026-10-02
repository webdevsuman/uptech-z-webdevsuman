"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { endpoints } from "@/api/endpoints";
import { api } from "@/api/apiClient";
import { UserEnum } from "./key";
import {
  TUserListParams,
  TUserListResponse,
  TUserPayload,
  TUserResponse,
} from "./schema";


export const useUsersList = (params?: TUserListParams) => {
  return useQuery({
    queryKey: [UserEnum.list, params],
    queryFn: () =>
      api.get<TUserListResponse>(endpoints.users.list, { params }),
  });
};


export const useUserDetails = (id: string) => {
  return useQuery({
    queryKey: [UserEnum.details, id],
    queryFn: () =>
      api.get<TUserResponse["details"]>(endpoints.users.details(id)),
    enabled: Boolean(id),
  });
};


export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [UserEnum.update],
    mutationFn: ({ id, ...payload }: TUserPayload["update"]) =>
      api.patch<TUserResponse["update"]>(endpoints.users.details(id), payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [UserEnum.list] });
    },
  });
};


export const useToggleUserStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [UserEnum.toggleStatus],
    mutationFn: ({ id, ...payload }: TUserPayload["toggleStatus"]) =>
      api.patch<TUserResponse["toggleStatus"]>(
        `${endpoints.users.details(id)}/status`,
        payload
      ),
    onSuccess: (_,variables) => {
      queryClient.invalidateQueries({ queryKey: [UserEnum.list] });
      queryClient.invalidateQueries({queryKey: [UserEnum.details,variables.id]})
    },
  });
};


export const useVerifyUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [UserEnum.verify],
    mutationFn: ({ id, ...payload }: TUserPayload["verify"]) =>
      api.patch<TUserResponse["verify"]>(
        `${endpoints.users.details(id)}/verify`,
        payload
      ),
    onSuccess: (_,variables) => {
      queryClient.invalidateQueries({ queryKey: [UserEnum.list] });
      queryClient.invalidateQueries({queryKey: [UserEnum.details,variables.id]})
    },
  });
};
