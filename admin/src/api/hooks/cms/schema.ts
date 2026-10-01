import { TAPIResponse } from '@/types/common/common.schema';

export type THomeAsset = {
  _id: string;
  section: string;
  title: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
};

export type TCMSPayload = {
  createHomeAsset: {
    section: string;
    title: string;
    description: string;
  };
};

export type TCMSResponse = {
  getHomeAssets: TAPIResponse<THomeAsset[]>;
  createHomeAsset: TAPIResponse<THomeAsset>;
};
