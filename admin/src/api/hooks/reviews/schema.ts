import { TAPIResponse } from "@/types/common/common.schema";

export interface IReviewStudent {
  _id: string;
  name: string;
  email: string;
  profilePicture?: string;
}

export interface IReviewCourse {
  _id: string;
  title: string;
  thumbnail?: string | { url?: string };
  price?: number;
  rating?: number;
}

export interface IReviewItem {
  _id: string;
  student: IReviewStudent;
  course: IReviewCourse;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface IReviewsMeta {
  total: number;
  averageRating: number;
  breakdown: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export type TReviewListResponse = TAPIResponse<IReviewItem[]> & {
  meta?: IReviewsMeta;
};

export type TReviewPayload = {
  delete: {
    id: string;
  };
};

export type TReviewResponse = {
  list: TReviewListResponse;
  delete: TAPIResponse<null>;
};
