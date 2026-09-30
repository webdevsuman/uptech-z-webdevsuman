import { TAPIResponse, TCommonSchema } from '@/types/common/common.schema';

export type TAuthPayload = {
  login: {
    email: string;
    password: string;
  };
  register: {
    name: string;
    email: string;
    password: string;
    role?: string;
  };
  'verify-otp': {
    userId: string;
    otp: string;
  };
  'resend-otp': {
    userId: string;
  };
  'forgot-password': {
    email: string;
  };
  'reset-password': {
    token: string;
    newPassword: string;
  };
  'refresh-token': {
    refreshToken: string;
  };
};

export type TAuthResponse = {
  login: TAPIResponse<{
    id: string;
    name: string;
    email: string;
    role: string;
    isVerified: boolean;
    accessToken: string;
    refreshToken: string;
  }>;
  register: TAPIResponse<{
    id: string;
    name: string;
    email: string;
    role: string;
    isVerified: boolean;
  }>;
  'verify-otp': TAPIResponse<Record<string, unknown>>;
  'resend-otp': TAPIResponse<Record<string, unknown>>;
  'forgot-password': TAPIResponse<Record<string, unknown>>;
  'reset-password': TAPIResponse<Record<string, unknown>>;
  'refresh-token': TAPIResponse<TCommonSchema['token']>;
  logout: TAPIResponse<Record<string, unknown>>;
};
