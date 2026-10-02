import { TAPIResponse } from "@/types/common/common.schema";

export interface ITagItem {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt?: string;
}

export type TTagPayload = {
  create: {
    name: string;
  };
  update: {
    id: string;
    name: string;
  };
  delete: {
    id: string;
  };
};

export type TTagListResponse = TAPIResponse<ITagItem[]>;

export type TTagResponse = {
  list: TTagListResponse;
  details: TAPIResponse<ITagItem>;
  create: TAPIResponse<ITagItem>;
  update: TAPIResponse<ITagItem>;
  delete: TAPIResponse<null>;
};
