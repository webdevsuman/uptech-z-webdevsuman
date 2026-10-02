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
