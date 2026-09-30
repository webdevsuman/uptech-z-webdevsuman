import { endpoints } from '@/api/endpoints';
import { sToast } from '@/components/ui/alert/stoast';
import { baseUrlApi } from '@/lib/constants';
import { getRefreshToken, getToken, triggerLogout, updateTokens } from '@/lib/functions/auth.lib';
import { TAPIResponse } from '@/types/common/common.schema';
import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { TAuthResponse } from '../hooks/auth/schema';

declare module 'axios' {
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
const successStatusCodes = [200, 201];
let failedQueue: TFailedRequest[] = [];
const defaultMessage = 'Something went wrong';
const refreshTokenEndpoint = endpoints.auth['refresh-token'];

const axiosInstance = axios.create({
  baseURL: baseUrlApi,
});

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach(p => {
    if (error) {
      p.reject(error);
    } else {
      p.config._retry = true;
      if (p.config.headers) {
        p.config.headers['Authorization'] = `Bearer ${token}`;
      }
      p.resolve(axiosInstance(p.config));
    }
  });
  failedQueue = [];
};

// ---- Request Interceptor ----
axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getToken();
  if (token && config.headers) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// ---- Response Interceptor ----
axiosInstance.interceptors.response.use(
  response => {
    const { config, status, data } = response;
    const showToast = config.showSuccessToast ?? true;

    if (config?.method !== 'get' && successStatusCodes.includes(status) && showToast) {
      sToast.success(data?.message || defaultMessage);
    } else if (!successStatusCodes.includes(status)) {
      sToast.warning(data?.message || defaultMessage);
    }
    return response;
  },
  async (error: AxiosError<TAPIResponse>) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const isRefreshTokenRequest = originalRequest.url?.includes(refreshTokenEndpoint);

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
          if (token || rToken) triggerLogout();
          return Promise.reject(error);
        }

        const { data } = await axios.post<TAuthResponse['refresh-token']>(
          `${baseUrlApi}${refreshTokenEndpoint}`,
          {
            refreshToken: rToken,
          }
        );

        const { accessToken, refreshToken: newRefreshToken } = data.data;

        if (accessToken) {
          updateTokens(accessToken, newRefreshToken);
          processQueue(null, accessToken);
          originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (err) {
        processQueue(err as AxiosError);
        triggerLogout();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    sToast.error(error.response?.data?.message || defaultMessage);
    return Promise.reject(error);
  }
);

export default axiosInstance;
