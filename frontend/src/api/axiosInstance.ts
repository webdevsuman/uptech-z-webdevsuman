import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { baseUrlApi, endpoints } from "./endpoints";
import {
  getRefreshToken,
  getToken,
  triggerLogout,
  updateTokens,
} from "@/lib/token.lib";
import { sToast } from "@/components/ui/alert/stoast";
import { IApiResponse, IAuthResponseData } from "@/typescript/interface/auth.interface";

declare module "axios" {
  export interface AxiosRequestConfig {
    _retry?: boolean;
    showSuccessToast?: boolean;
  }
}

type TFailedRequest = {
  reject: (reason?: unknown) => void;
  config: InternalAxiosRequestConfig;
  resolve: (value: AxiosResponse | PromiseLike<AxiosResponse>) => void;
};

let isRefreshing = false;
let failedQueue: TFailedRequest[] = [];
const successStatusCodes = [200, 201];
const defaultMessage = "Something went wrong";
const refreshTokenEndpoint = endpoints.auth.refreshToken;

const axiosInstance = axios.create({
  baseURL: baseUrlApi,
  headers: {
    "Content-Type": "application/json",
  },
});

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((p) => {
    if (error) {
      p.reject(error);
    } else {
      p.config._retry = true;
      if (p.config.headers) {
        p.config.headers["Authorization"] = `Bearer ${token}`;
        p.config.headers["x-access-token"] = token || "";
      }
      p.resolve(axiosInstance(p.config));
    }
  });
  failedQueue = [];
};

// ---- Request Interceptor ----
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
      config.headers["x-access-token"] = token;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ---- Response Interceptor ----
axiosInstance.interceptors.response.use(
  (response) => {
    const { config, status, data } = response;
    const showToast = config?.showSuccessToast ?? false;

    if (config?.method !== "get" && successStatusCodes.includes(status) && showToast) {
      sToast.success(data?.message || defaultMessage);
    }
    return response;
  },
  async (error: AxiosError<IApiResponse>) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const isRefreshTokenRequest = originalRequest.url?.includes(refreshTokenEndpoint);

    // Handle 401 & Auto-Refresh Token
    if (error.response?.status === 401 && !originalRequest._retry && !isRefreshTokenRequest) {
      if (isRefreshing) {
        return new Promise<AxiosResponse>((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalRequest });
        });
      }

      isRefreshing = true;
      originalRequest._retry = true;

      try {
        const token = getToken();
        const rToken = getRefreshToken();

        if (!token || !rToken) {
          triggerLogout();
          return Promise.reject(error);
        }

        const res = await axios.post<IApiResponse<IAuthResponseData>>(
          `${baseUrlApi}${refreshTokenEndpoint}`,
          {
            refreshToken: rToken,
          }
        );

        const newAccessToken = res.data.data?.accessToken;
        const newRefreshToken = res.data.data?.refreshToken;

        if (newAccessToken) {
          updateTokens(newAccessToken, newRefreshToken);
          processQueue(null, newAccessToken);
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          originalRequest.headers["x-access-token"] = newAccessToken;
          return axiosInstance(originalRequest);
        }
      } catch (refreshErr) {
        processQueue(refreshErr as AxiosError);
        triggerLogout();
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
