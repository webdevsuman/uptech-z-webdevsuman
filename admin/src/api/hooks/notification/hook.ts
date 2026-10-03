"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { endpoints } from "@/api/endpoints";
import { api } from "@/api/apiClient";
import { NotificationEnum } from "./key";
import {
  TNotificationsResponse,
  TMarkReadResponse,
  TMarkAllReadResponse,
} from "./schema";

export const useAdminNotifications = () => {
  return useQuery({
    queryKey: [NotificationEnum.list],
    queryFn: () =>
      api.get<TNotificationsResponse>(endpoints.notifications.list),
  });
};

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [NotificationEnum.markRead],
    mutationFn: ({ id }: { id: string }) =>
      api.patch<TMarkReadResponse>(endpoints.notifications.markRead(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NotificationEnum.list] });
    },
  });
};

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [NotificationEnum.markAllRead],
    mutationFn: () =>
      api.patch<TMarkAllReadResponse>(endpoints.notifications.markAllRead),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NotificationEnum.list] });
    },
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [NotificationEnum.delete],
    mutationFn: ({ id }: { id: string }) =>
      api.delete<{ success: boolean; message: string }>(
        endpoints.notifications.delete(id)
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NotificationEnum.list] });
    },
  });
};

export const useDeleteAllNotifications = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [NotificationEnum.deleteAll],
    mutationFn: () =>
      api.delete<{ success: boolean; message: string }>(
        endpoints.notifications.deleteAll
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NotificationEnum.list] });
    },
  });
};
