"use client";

import { useMutation } from "@tanstack/react-query";
import { endpoints } from "@/api/endpoints";
import { api } from "@/api/apiClient";
import {
  IApiResponse,
  IAuthResponseData,
  IRegisterResponseData,
  TForgotPasswordPayload,
  TLoginPayload,
  TRegisterPayload,
  TResendOtpPayload,
  TResetPasswordPayload,
  TVerifyOtpPayload,
} from "@/typescript/interface/auth.interface";
import { triggerLogout, updateTokens } from "@/lib/token.lib";
import { AuthEnumKeys } from "./keys";

export const useLogin = () => {
  return useMutation<IApiResponse<IAuthResponseData>, Error, TLoginPayload>({
    mutationKey: [AuthEnumKeys.login],
    mutationFn: (payload: TLoginPayload) =>
      api.post<IApiResponse<IAuthResponseData>>(endpoints.auth.login, payload),
    onSuccess: (response) => {
      if (response?.data?.accessToken) {
        updateTokens(response.data.accessToken, response.data.refreshToken);
      }
    },
  });
};

export const useRegister = () => {
  return useMutation<IApiResponse<IRegisterResponseData>, Error, TRegisterPayload>({
    mutationKey: [AuthEnumKeys.register],
    mutationFn: (payload: TRegisterPayload) =>
      api.post<IApiResponse<IRegisterResponseData>>(endpoints.auth.register, payload),
  });
};

export const useVerifyOtp = () => {
  return useMutation<IApiResponse, Error, TVerifyOtpPayload>({
    mutationKey: [AuthEnumKeys.verifyOtp],
    mutationFn: (payload: TVerifyOtpPayload) =>
      api.post<IApiResponse>(endpoints.auth.verifyOtp, payload),
  });
};

export const useResendOtp = () => {
  return useMutation<IApiResponse, Error, TResendOtpPayload>({
    mutationKey: [AuthEnumKeys.resendOtp],
    mutationFn: (payload: TResendOtpPayload) =>
      api.post<IApiResponse>(endpoints.auth.resendOtp, payload),
  });
};

export const useForgotPassword = () => {
  return useMutation<IApiResponse, Error, TForgotPasswordPayload>({
    mutationKey: [AuthEnumKeys.forgotPassword],
    mutationFn: (payload: TForgotPasswordPayload) =>
      api.post<IApiResponse>(endpoints.auth.forgotPassword, payload),
  });
};

export const useResetPassword = () => {
  return useMutation<IApiResponse, Error, TResetPasswordPayload>({
    mutationKey: [AuthEnumKeys.resetPassword],
    mutationFn: (payload: TResetPasswordPayload) =>
      api.post<IApiResponse>(endpoints.auth.resetPassword, payload),
  });
};

export const useLogout = () => {
  return useMutation<IApiResponse, Error, void>({
    mutationKey: [AuthEnumKeys.logout],
    mutationFn: () => api.post<IApiResponse>(endpoints.auth.logout),
    onSettled: () => {
      triggerLogout();
    },
  });
};

export const authService = {
  useLogin,
  useRegister,
  useVerifyOtp,
  useResendOtp,
  useForgotPassword,
  useResetPassword,
  useLogout,
};

