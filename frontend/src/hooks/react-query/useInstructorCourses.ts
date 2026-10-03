"use client";

import { useQuery } from "@tanstack/react-query";
import { CourseQueryEnum } from "./hook-keys/allProject.keys";
import { endpoints } from "@/api/endpoints";
import api from "@/api/apiClient";
import { ICourse } from "@/typescript/interface/course.interface";

export interface InstructorCoursesApiResponse {
  success: boolean;
  data: ICourse[];
}

export const useInstructorCourses = () => {
  return useQuery<ICourse[]>({
    queryKey: [CourseQueryEnum.Courses, "instructor"],
    queryFn: async () => {
      const response = await api.get<InstructorCoursesApiResponse>(
        endpoints.courses.instructorList
      );
      return response.data ?? [];
    },
  });
};

export interface IInstructorDashboardStats {
  totalStudents: number;
  totalEnrollments: number;
  totalCourses: number;
  activeCourses: number;
  underReviewCourses: number;
  draftCourses: number;
  totalEarnings: number;
  averageRating: number;
  unansweredQnACount: number;
}

export const useInstructorDashboardStats = () => {
  return useQuery<IInstructorDashboardStats>({
    queryKey: [CourseQueryEnum.InstructorStats],
    queryFn: async () => {
      const response = await api.get<{
        success: boolean;
        data: IInstructorDashboardStats;
      }>(endpoints.courses.instructorStats);
      return (
        response.data ?? {
          totalStudents: 0,
          totalEnrollments: 0,
          totalCourses: 0,
          activeCourses: 0,
          underReviewCourses: 0,
          draftCourses: 0,
          totalEarnings: 0,
          averageRating: 0,
          unansweredQnACount: 0,
        }
      );
    },
  });
};
