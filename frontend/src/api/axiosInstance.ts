import { accessTokenName, baseURL, refreshTokenName } from "@/config/constants";
import { getToken, setToken } from "@/lib/token.lib";
import axios from "axios";
import { deleteCookie, getCookie } from "cookies-next";
import { redirect } from "next/navigation";
import { baseUrlApi } from "./endpoints";

const axiosInstance = axios.create({
  baseURL: baseUrlApi,
  headers: {
    "Content-Type": "application/json",
  },
});

// 1. Request Interceptor: Attach token dynamically on EVERY request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers["x-access-token"] = token;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 2. Response Interceptor: Handle 401 & Auto-Refresh Token
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 and request hasn't been retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken =
          getCookie(refreshTokenName) ||
          window.localStorage.getItem(refreshTokenName) ||
          window.sessionStorage.getItem(refreshTokenName);

        // Request a new access token from your backend
        const res = await axios.post(`${baseURL}/auth/refresh-token`, {
          refreshToken,
        });

        const newAccessToken = res.data.accessToken;

        // Save new token and update header for the retried request
        setToken(newAccessToken);
        originalRequest.headers["x-access-token"] = newAccessToken;

        // Re-run the failed original request with the new token
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh failed (token expired or invalid) -> clear storage and redirect to login
        window.localStorage.clear();
        window.sessionStorage.clear();
        deleteCookie(refreshTokenName);
        deleteCookie(accessTokenName);
        // redirect("/auth/login");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
