import { TAPIResponse } from "@/types/common/common.schema";

export interface IUserItem {
  _id: string;
  name: string;
  email: string;
  role: {
    _id: string;
    name: string;
  };
  isActive: boolean;
  isVerified: boolean;
  bio?: string;
  qualification?: string;
  createdAt: string;
}

export type TUserListParams = {
  search?: string;
  role?: string;
  isActive?: boolean;
  isVerified?: boolean;
  page?: number;
  limit?: number;
};

export type TUserPayload = {
  update: {
    id: string;
    name?: string;
    bio?: string;
    qualification?: string;
    role?: string;
  };
  toggleStatus: {
    id: string;
    isActive?: boolean;
  };
  verify: {
    id: string;
    isVerified?: boolean;
  };
};

export type TUserListResponse = TAPIResponse<IUserItem[]> & {
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type TUserResponse = {
  list: TUserListResponse;
  details: TAPIResponse<IUserItem>;
  update: TAPIResponse<IUserItem>;
  toggleStatus: TAPIResponse<{ id: string; isActive: boolean }>;
  verify: TAPIResponse<{ id: string; isVerified: boolean }>;
};
