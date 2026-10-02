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
};
