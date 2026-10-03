import { TAPIResponse } from "@/types/common/common.schema";

export interface IDashboardOverview {
  totalStudents: number;
  totalInstructors: number;
  totalCourses: number;
  activeCourses: number;
  draftCourses: number;
  underReviewCourses: number;
  totalRevenue: number;
  totalEnrollments: number;
}

export interface ITopRevenueCourse {
  courseId: string;
  title: string;
  thumbnail: string;
  instructorId: string;
  instructorName: string;
  enrollmentsCount: number;
  revenue: number;
}

export interface IMonthlyTrend {
  month: string;
  revenue: number;
  enrollments: number;
}

export interface ITopInstructor {
  instructorId: string;
  name: string;
  email: string;
  profilePicture: string;
  coursesCount: number;
  studentsCount: number;
  totalRevenue: number;
}

export interface ICategoryDistribution {
  _id: string;
  name: string;
  count: number;
}

export interface IDashboardAnalyticsData {
  overview: IDashboardOverview;
  topRevenueCourses: ITopRevenueCourse[];
  monthlyTrends: IMonthlyTrend[];
  topInstructors: ITopInstructor[];
  categoryDistribution: ICategoryDistribution[];
}

export type TDashboardAnalyticsResponse = TAPIResponse<IDashboardAnalyticsData>;
