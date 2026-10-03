"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { endpoints } from "@/api/endpoints";
import { api } from "@/api/apiClient";
import { CourseEnum } from "./key";
import {
  TCourseListParams,
  TCourseListResponse,
  TCoursePayload,
  TCourseResponse,
} from "./schema";

export const useAdminCoursesList = (params?: TCourseListParams) => {
  return useQuery({
    queryKey: [CourseEnum.list, params],
    queryFn: () =>
      api.get<TCourseListResponse>(endpoints.courses.listAdmin, { params }),
  });
};

export const useCourseDetails = (id: string) => {
  return useQuery({
    queryKey: [CourseEnum.details, id],
    queryFn: () =>
      api.get<TCourseResponse["details"]>(endpoints.courses.details(id)),
    enabled: Boolean(id),
  });
};

export const useUpdateCourseStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [CourseEnum.updateStatus],
    mutationFn: ({ id, status }: TCoursePayload["updateStatus"]) =>
      api.patch<TCourseResponse["updateStatus"]>(
        endpoints.courses.updateStatus(id),
        { status }
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [CourseEnum.list] });
      queryClient.invalidateQueries({
        queryKey: [CourseEnum.details, variables.id],
      });
    },
  });
};

export const useToggleCourseFeatured = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [CourseEnum.toggleFeatured],
    mutationFn: ({ id, ...payload }: TCoursePayload["toggleFeatured"]) =>
      api.patch<TCourseResponse["toggleFeatured"]>(
        endpoints.courses.toggleFeatured(id),
        payload
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [CourseEnum.list] });
      queryClient.invalidateQueries({
        queryKey: [CourseEnum.details, variables.id],
      });
    },
  });
};

export const useToggleCourseTrending = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [CourseEnum.toggleTrending],
    mutationFn: ({ id, ...payload }: TCoursePayload["toggleTrending"]) =>
      api.patch<TCourseResponse["toggleTrending"]>(
        endpoints.courses.toggleTrending(id),
        payload
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [CourseEnum.list] });
      queryClient.invalidateQueries({
        queryKey: [CourseEnum.details, variables.id],
      });
    },
  });
};

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [CourseEnum.delete],
    mutationFn: (id: string) =>
      api.delete<TCourseResponse["delete"]>(endpoints.courses.delete(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CourseEnum.list] });
    },
  });
};
