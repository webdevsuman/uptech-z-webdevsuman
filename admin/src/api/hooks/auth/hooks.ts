'use client';

import { useMutation } from '@tanstack/react-query';
import { endpoints } from '@/api/endpoints';
import { api } from '@/api/apiClient';
import { AuthEnum } from './key';
import { TAuthPayload, TAuthResponse } from './schema';
import { triggerLogout, updateTokens } from '@/lib/functions/auth.lib';

export const useLogin = () => {
  return useMutation<TAuthResponse['login'], Error, TAuthPayload['login']>({
    mutationKey: [AuthEnum.login],
    mutationFn: (payload: TAuthPayload['login']) =>
      api.post<TAuthResponse['login']>(endpoints.auth.login, payload),
    onSuccess: (response) => {
      if (response?.data?.accessToken) {
        updateTokens(response.data.accessToken, response.data.refreshToken);
      }
    },
  });
};

export const useRegister = () => {
  return useMutation<TAuthResponse['register'], Error, TAuthPayload['register']>({
    mutationKey: [AuthEnum.register],
    mutationFn: (payload: TAuthPayload['register']) =>
      api.post<TAuthResponse['register']>(endpoints.auth.register, payload),
  });
};

export const useVerifyOtp = () => {
  return useMutation<TAuthResponse['verify-otp'], Error, TAuthPayload['verify-otp']>({
    mutationKey: [AuthEnum.verifyOtp],
    mutationFn: (payload: TAuthPayload['verify-otp']) =>
      api.post<TAuthResponse['verify-otp']>(endpoints.auth.verifyOtp, payload),
  });
};

export const useResendOtp = () => {
  return useMutation<TAuthResponse['resend-otp'], Error, TAuthPayload['resend-otp']>({
    mutationKey: [AuthEnum.resendOtp],
    mutationFn: (payload: TAuthPayload['resend-otp']) =>
      api.post<TAuthResponse['resend-otp']>(endpoints.auth.resendOtp, payload),
  });
};

export const useForgotPassword = () => {
  return useMutation<TAuthResponse['forgot-password'], Error, TAuthPayload['forgot-password']>({
    mutationKey: [AuthEnum.forgotPassword],
    mutationFn: (payload: TAuthPayload['forgot-password']) =>
      api.post<TAuthResponse['forgot-password']>(endpoints.auth['forgot-password'], payload),
  });
};

export const useResetPassword = () => {
  return useMutation<TAuthResponse['reset-password'], Error, TAuthPayload['reset-password']>({
    mutationKey: [AuthEnum.resetPassword],
    mutationFn: (payload: TAuthPayload['reset-password']) =>
      api.post<TAuthResponse['reset-password']>(endpoints.auth['reset-password'], payload),
  });
};

export const useLogout = () => {
  return useMutation<TAuthResponse['logout'], Error, void>({
    mutationKey: [AuthEnum.logout],
    mutationFn: () => api.post<TAuthResponse['logout']>(endpoints.auth.logout),
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
