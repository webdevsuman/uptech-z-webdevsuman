export type UserRole = "student" | "instructor" | "super-admin" | "sub-admin";

export interface IUser {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role: UserRole | { _id: string; name: UserRole };
  isVerified: boolean;
  avatar?: string;
  profilePicture?: string;
  bio?: string;
  qualification?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IAuthResponseData {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
  accessToken: string;
  refreshToken: string;
}

export interface IRegisterResponseData {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
}

export interface IApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

export type TLoginPayload = {
  email: string;
  password: string;
};

export type TRegisterPayload = {
  name: string;
  email: string;
  password: string;
  role: "student" | "instructor";
};

export type TVerifyOtpPayload = {
  userId: string;
  otp: string;
};

export type TResendOtpPayload = {
  userId: string;
};

export type TForgotPasswordPayload = {
  email: string;
};

export type TResetPasswordPayload = {
  userId: string;
  token: string;
  newPassword: string;
};
