import { TAPIResponse } from "@/types/common/common.schema";

export interface ICategoryItem {
  _id: string;
  name: string;
  icon?: string;
  createdAt: string;
  updatedAt?: string;
}

export type TCategoryPayload = {
  create: {
    name: string;
    icon?: string;
  };
  update: {
    id: string;
    name?: string;
    icon?: string;
  };
  delete: {
    id: string;
  };
};

export type TCategoryListResponse = TAPIResponse<ICategoryItem[]>;

export type TCategoryResponse = {
  list: TCategoryListResponse;
  details: TAPIResponse<ICategoryItem>;
  create: TAPIResponse<ICategoryItem>;
  update: TAPIResponse<ICategoryItem>;
  delete: TAPIResponse<null>;
};
