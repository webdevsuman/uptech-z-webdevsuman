import { TAPIResponse } from "@/types/common/common.schema";

export type TCourseStatus = "draft" | "under_review" | "published" | "rejected";

export type TCourseLevel = "beginner" | "intermediate" | "advanced" | "all_levels";

export interface ICourseCategory {
  _id: string;
  name: string;
  icon?: string;
}

export interface ICourseInstructor {
  _id: string;
  name: string;
  email: string;
}

export interface ILectureResource {
  _id: string;
  title: string;
  url: string;
  public_id?: string;
  fileType?: string;
  fileSize?: number;
}

export interface ILecture {
  _id: string;
  title: string;
  description?: string;
  order: number;
  isPreview: boolean;
  video?: {
    url: string;
    public_id?: string;
    duration?: number;
  };
  resources?: ILectureResource[];
}

export interface ISection {
  _id: string;
  title: string;
  order: number;
  lectures: ILecture[];
}

export interface ICourseItem {
  _id: string;
  title: string;
  subtitle?: string;
  description?: string;
  category: ICourseCategory;
  instructor: ICourseInstructor;
  level: TCourseLevel;
  language: string;
  thumbnail?: {
    url: string;
    public_id?: string;
  };
  price: number;
  status: TCourseStatus;
  isFeatured: boolean;
  isTrending: boolean;
  viewsCount?: number;
  sectionsCount?: number;
  lecturesCount?: number;
  sections?: ISection[];
  createdAt: string;
  updatedAt: string;
}

export type TCourseListParams = {
  search?: string;
  status?: string;
  category?: string;
  level?: string;
  sort?: string;
  page?: number;
  limit?: number;
};

export type TCoursePayload = {
  updateStatus: {
    id: string;
    status: TCourseStatus;
  };
  toggleFeatured: {
    id: string;
    isFeatured?: boolean;
  };
  toggleTrending: {
    id: string;
    isTrending?: boolean;
  };
};

export type TCourseListResponse = TAPIResponse<ICourseItem[]> & {
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type TCourseResponse = {
  list: TCourseListResponse;
  details: TAPIResponse<ICourseItem>;
  updateStatus: TAPIResponse<ICourseItem>;
  toggleFeatured: TAPIResponse<{ id: string; isFeatured: boolean }>;
  toggleTrending: TAPIResponse<{ id: string; isTrending: boolean }>;
  delete: TAPIResponse<null>;
};
