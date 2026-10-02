"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { endpoints } from "@/api/endpoints";
import api from "@/api/apiClient";
import { ISection } from "@/typescript/interface/course.interface";
import { CourseQueryEnum } from "./hook-keys/allProject.keys";

export interface CurriculumApiResponse {
  success: boolean;
  message: string;
  data: ISection[];
}

// 1. Add Section
export const useAddSection = (courseId: string) => {
  const queryClient = useQueryClient();
  return useMutation<CurriculumApiResponse, Error, { title: string }>({
    mutationFn: async ({ title }) => {
      const response = await api.post<CurriculumApiResponse>(
        endpoints.courses.addSection(courseId),
        { title }
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CourseQueryEnum.CourseDetails, courseId],
      });
    },
  });
};

// 2. Update Section
export const useUpdateSection = (courseId: string) => {
  const queryClient = useQueryClient();
  return useMutation<
    CurriculumApiResponse,
    Error,
    { sectionId: string; title: string }
  >({
    mutationFn: async ({ sectionId, title }) => {
      const response = await api.patch<CurriculumApiResponse>(
        endpoints.courses.updateSection(courseId, sectionId),
        { title }
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CourseQueryEnum.CourseDetails, courseId],
      });
    },
  });
};

// 3. Delete Section
export const useDeleteSection = (courseId: string) => {
  const queryClient = useQueryClient();
  return useMutation<CurriculumApiResponse, Error, { sectionId: string }>({
    mutationFn: async ({ sectionId }) => {
      const response = await api.delete<CurriculumApiResponse>(
        endpoints.courses.deleteSection(courseId, sectionId)
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CourseQueryEnum.CourseDetails, courseId],
      });
    },
  });
};

// 4. Add Lecture
export const useAddLecture = (courseId: string) => {
  const queryClient = useQueryClient();
  return useMutation<
    CurriculumApiResponse,
    Error,
    { sectionId: string; title: string; isPreview?: boolean }
  >({
    mutationFn: async ({ sectionId, title, isPreview }) => {
      const response = await api.post<CurriculumApiResponse>(
        endpoints.courses.addLecture(courseId, sectionId),
        { title, isPreview }
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CourseQueryEnum.CourseDetails, courseId],
      });
    },
  });
};

// 5. Update Lecture (details or video upload)
export const useUpdateLecture = (courseId: string) => {
  const queryClient = useQueryClient();
  return useMutation<
    CurriculumApiResponse,
    Error,
    {
      sectionId: string;
      lectureId: string;
      payload: FormData | { title?: string; description?: string; isPreview?: boolean };
    }
  >({
    mutationFn: async ({ sectionId, lectureId, payload }) => {
      const isFormData = typeof FormData !== "undefined" && payload instanceof FormData;
      const config = isFormData
        ? { headers: { "Content-Type": "multipart/form-data" } }
        : undefined;

      const response = await api.patch<CurriculumApiResponse>(
        endpoints.courses.updateLecture(courseId, sectionId, lectureId),
        payload,
        config
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CourseQueryEnum.CourseDetails, courseId],
      });
    },
  });
};

// 6. Delete Lecture
export const useDeleteLecture = (courseId: string) => {
  const queryClient = useQueryClient();
  return useMutation<
    CurriculumApiResponse,
    Error,
    { sectionId: string; lectureId: string }
  >({
    mutationFn: async ({ sectionId, lectureId }) => {
      const response = await api.delete<CurriculumApiResponse>(
        endpoints.courses.deleteLecture(courseId, sectionId, lectureId)
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CourseQueryEnum.CourseDetails, courseId],
      });
    },
  });
};

// 7. Add Lecture Resource (PDF / Document)
export const useAddLectureResource = (courseId: string) => {
  const queryClient = useQueryClient();
  return useMutation<
    CurriculumApiResponse,
    Error,
    { sectionId: string; lectureId: string; formData: FormData }
  >({
    mutationFn: async ({ sectionId, lectureId, formData }) => {
      const response = await api.post<CurriculumApiResponse>(
        endpoints.courses.addLectureResource(courseId, sectionId, lectureId),
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CourseQueryEnum.CourseDetails, courseId],
      });
    },
  });
};

// 8. Delete Lecture Resource
export const useDeleteLectureResource = (courseId: string) => {
  const queryClient = useQueryClient();
  return useMutation<
    CurriculumApiResponse,
    Error,
    { sectionId: string; lectureId: string; resourceId: string }
  >({
    mutationFn: async ({ sectionId, lectureId, resourceId }) => {
      const response = await api.delete<CurriculumApiResponse>(
        endpoints.courses.deleteLectureResource(
          courseId,
          sectionId,
          lectureId,
          resourceId
        )
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CourseQueryEnum.CourseDetails, courseId],
      });
    },
  });
};
