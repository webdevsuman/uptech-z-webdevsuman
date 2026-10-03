import { baseURL as rawBaseUrl } from "@/config/constants";

// Ensure baseUrl has a clean trailing slash without duplicates
const base = rawBaseUrl ? (rawBaseUrl.endsWith("/") ? rawBaseUrl : `${rawBaseUrl}/`) : "http://localhost:5000/api/";

export const baseUrl = base;
export const baseUrlApi = base;

export const endpoints = {
  auth: {
    login: "auth/login",
    register: "auth/register",
    verifyOtp: "auth/verify-otp",
    resendOtp: "auth/resend-otp",
    forgotPassword: "auth/forgot-password",
    resetPassword: "auth/reset-password",
    refreshToken: "auth/refresh-token",
    logout: "auth/logout",
  },
  cms: {
    homepage: "v2/homepage",
  },
  categories: {
    list: "categories",
  },
  courses: {
    list: "courses",
    create: "courses",
    instructorList: "courses/instructor",
    instructorStats: "courses/instructor/stats",
    featured: "courses/featured",
    trending: "courses/trending",
    details: (id: string) => `courses/${id}`,
    update: (id: string) => `courses/${id}`,
    delete: (id: string) => `courses/${id}`,
    // Curriculum endpoints
    addSection: (id: string) => `courses/${id}/sections`,
    updateSection: (id: string, sectionId: string) => `courses/${id}/sections/${sectionId}`,
    deleteSection: (id: string, sectionId: string) => `courses/${id}/sections/${sectionId}`,
    addLecture: (id: string, sectionId: string) => `courses/${id}/sections/${sectionId}/lectures`,
    updateLecture: (id: string, sectionId: string, lectureId: string) =>
      `courses/${id}/sections/${sectionId}/lectures/${lectureId}`,
    deleteLecture: (id: string, sectionId: string, lectureId: string) =>
      `courses/${id}/sections/${sectionId}/lectures/${lectureId}`,
    addLectureResource: (id: string, sectionId: string, lectureId: string) =>
      `courses/${id}/sections/${sectionId}/lectures/${lectureId}/resources`,
    deleteLectureResource: (
      id: string,
      sectionId: string,
      lectureId: string,
      resourceId: string
    ) =>
      `courses/${id}/sections/${sectionId}/lectures/${lectureId}/resources/${resourceId}`,
  },
  users: {
    profile: "users/profile",
  },
  announcements: {
    list: "announcements",
    public: "announcements/public",
    create: "announcements",
    update: (id: string) => `announcements/${id}`,
    delete: (id: string) => `announcements/${id}`,
  },
  reviews: {
    courseReviews: (courseId: string) => `reviews/course/${courseId}`,
    eligibility: (courseId: string) => `reviews/eligibility/${courseId}`,
    create: "reviews",
    my: "reviews/my",
  },
  enrollments: {
    enroll: "enrollments",
    status: (courseId: string) => `enrollments/status/${courseId}`,
    my: "enrollments/my",
  },
  wishlist: {
    toggle: "wishlist/toggle",
    status: (courseId: string) => `wishlist/status/${courseId}`,
    my: "wishlist/my",
  },
  qna: {
    courseQuestions: (courseId: string) => `qna/course/${courseId}`,
    instructorQuestions: "qna/instructor",
    ask: "qna",
    reply: (questionId: string) => `qna/${questionId}/reply`,
    delete: (questionId: string) => `qna/${questionId}`,
  },
};
