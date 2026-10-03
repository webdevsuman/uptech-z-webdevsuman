"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { endpoints } from "@/api/endpoints";
import api from "@/api/apiClient";
import { QnAQueryEnum } from "./hook-keys/allProject.keys";
import {
  IQnAQuestion,
  InstructorQuestionsData,
  CreateQuestionPayload,
  CreateReplyPayload,
} from "@/typescript/interface/qna.interface";

interface QnAApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data: T;
}

export const useCourseQuestions = (
  courseId: string,
  search?: string,
  enabled: boolean = true
) => {
  return useQuery<IQnAQuestion[]>({
    queryKey: [QnAQueryEnum.CourseQuestions, courseId, { search: search || "" }],
    queryFn: async () => {
      const response = await api.get<QnAApiResponse<IQnAQuestion[]>>(
        endpoints.qna.courseQuestions(courseId),
        search?.trim() ? { params: { search: search.trim() } } : undefined
      );
      return response.data ?? [];
    },
    enabled: Boolean(courseId && enabled),
  });
};

export const useAskQuestion = (courseId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateQuestionPayload) => {
      const response = await api.post<QnAApiResponse<IQnAQuestion>>(
        endpoints.qna.ask,
        payload
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QnAQueryEnum.CourseQuestions, courseId],
      });
    },
  });
};

export const useReplyQuestion = (courseId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ questionId, message }: CreateReplyPayload) => {
      const response = await api.post<QnAApiResponse<IQnAQuestion>>(
        endpoints.qna.reply(questionId),
        { message }
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QnAQueryEnum.CourseQuestions],
      });
      queryClient.invalidateQueries({
        queryKey: [QnAQueryEnum.InstructorQuestions],
      });
    },
  });
};

export const useDeleteQuestion = (courseId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (questionId: string) => {
      const response = await api.delete<QnAApiResponse<null>>(
        endpoints.qna.delete(questionId)
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QnAQueryEnum.CourseQuestions],
      });
      queryClient.invalidateQueries({
        queryKey: [QnAQueryEnum.InstructorQuestions],
      });
    },
  });
};

export interface InstructorQuestionsParams {
  courseId?: string;
  filter?: "all" | "unanswered" | "answered";
  search?: string;
  limit?: number;
}

export const useInstructorQuestions = (params?: InstructorQuestionsParams) => {
  return useQuery<InstructorQuestionsData>({
    queryKey: [QnAQueryEnum.InstructorQuestions, params],
    queryFn: async () => {
      const response = await api.get<QnAApiResponse<InstructorQuestionsData>>(
        endpoints.qna.instructorQuestions,
        params ? { params } : undefined
      );
      return (
        response.data ?? {
          questions: [],
          counts: { total: 0, unanswered: 0, answered: 0 },
        }
      );
    },
  });
};
