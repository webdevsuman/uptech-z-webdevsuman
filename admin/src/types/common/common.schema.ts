import { ActionEnum, SubjectEnum } from '../enums/common.enum';

export type TCommonSchema = {
  BaseAPIResponse: {
    success: boolean;
    message: string;
  };

  BaseAPIFields: {
    _id: string;
    createdAt: string;
    updatedAt?: string;
  };

  token: {
    accessToken: string;
    refreshToken: string;
  };

  access: {
    subject: SubjectEnum;
    actions: ActionEnum[];
  }[];

  role: {
    _id: string;
    name: string;
    permissions?: string[];
  };

  userData: {
    id: string;
    _id?: string;
    name: string;
    email: string;
    role: string;
    isVerified: boolean;
    profileImage?: string;
    createdAt?: string;
    updatedAt?: string;
  };

  file:
    | string
    | File
    | { file?: string | File; name: string }
    | (string | File | { file?: string | File; name: string })[]
    | null;

  option: {
    value: string;
    label: string;
  };

  sort: 'asc' | 'desc';
};

export type TPagination<T = unknown> = {
  payload: {
    page: number;
    limit: number;
    search?: string;
    sortField?: string;
    sortOrder?: TCommonSchema['sort'];
    status?: string;
  };

  meta: {
    page: number;
    limit: number;
    totalDocs: number;
    totalPages: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    prevPage: null | number;
    nextPage: null | number;
  };

  response: {
    docs: T[];
    meta: TPagination['meta'];
  };
};

export type TAPIResponse<T = unknown> = {
  success: boolean;
  message: string;
  data: T;
};
