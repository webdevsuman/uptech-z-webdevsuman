"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { endpoints } from "@/api/endpoints";
import api from "@/api/apiClient";
import { AnnouncementQueryEnum } from "./hook-keys/allProject.keys";
import {
  IAnnouncement,
  CreateAnnouncementPayload,
  UpdateAnnouncementPayload,
} from "@/typescript/interface/announcement.interface";

export interface AnnouncementApiResponse<T = IAnnouncement> {
  success: boolean;
  message?: string;
  data: T;
}

export const useInstructorAnnouncements = (courseId?: string) => {
  return useQuery<IAnnouncement[]>({
    queryKey: [AnnouncementQueryEnum.Announcements, { courseId: courseId || "all" }],
    queryFn: async () => {
      const response = await api.get<AnnouncementApiResponse<IAnnouncement[]>>(
        endpoints.announcements.list,
        courseId ? { params: { courseId } } : undefined
      );
      return response.data ?? [];
    },
  });
};

export const useCreateAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation<
    AnnouncementApiResponse<IAnnouncement>,
    Error,
    CreateAnnouncementPayload
  >({
    mutationFn: async (payload: CreateAnnouncementPayload) => {
      return await api.post<AnnouncementApiResponse<IAnnouncement>>(
        endpoints.announcements.create,
        payload
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [AnnouncementQueryEnum.Announcements],
      });
    },
  });
};

export const useUpdateAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation<
    AnnouncementApiResponse<IAnnouncement>,
    Error,
    UpdateAnnouncementPayload
  >({
    mutationFn: async (payload: UpdateAnnouncementPayload) => {
      const { id, ...data } = payload;
      return await api.patch<AnnouncementApiResponse<IAnnouncement>>(
        endpoints.announcements.update(id),
        data
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [AnnouncementQueryEnum.Announcements],
      });
    },
  });
};

export const useDeleteAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation<AnnouncementApiResponse<null>, Error, string>({
    mutationFn: async (id: string) => {
      return await api.delete<AnnouncementApiResponse<null>>(
        endpoints.announcements.delete(id)
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [AnnouncementQueryEnum.Announcements],
      });
    },
  });
};
