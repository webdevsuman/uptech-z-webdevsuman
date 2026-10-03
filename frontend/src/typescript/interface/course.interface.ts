export interface ICourseInstructor {
  _id: string;
  name: string;
  email?: string;
}

export interface ICourseCategory {
  _id: string;
  name: string;
  icon?: string;
}

export interface ILectureResource {
  _id?: string;
  id?: string;
  title: string;
  url: string;
  public_id?: string;
  fileType?: string;
  fileSize?: number;
}

export interface ILecture {
  _id?: string;
  id?: string;
  title: string;
  description?: string;
  order?: number;
  video?: {
    url?: string;
    public_id?: string;
    duration?: number;
  };
  isPreview?: boolean;
  resources?: ILectureResource[];
}

export interface ISection {
  _id?: string;
  id?: string;
  title: string;
  order?: number;
  lectures: ILecture[];
}

export interface ICourse {
  _id: string;
  id?: string;
  title: string;
  subtitle?: string;
  description?: string;
  category: ICourseCategory | string;
  instructor: ICourseInstructor | string;
  level: "beginner" | "intermediate" | "advanced" | "all_levels" | string;
  language?: string;
  price: number;
  currency?: string;
  thumbnail?: string | { url: string; public_id?: string };
  image_path?: string; // backwards compatibility
  trailer?: string;
  status: "draft" | "under_review" | "published" | "rejected" | string;
  isFeatured?: boolean;
  isTrending?: boolean;
  viewsCount?: number;
  rating?: number;
  reviewsCount?: number;
  sections?: ISection[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CourseFilters {
  search?: string;
  categoryId?: string;
  category?: string;
  level?: string;
  price?: string;
  rating?: string;
  sort?: string;
  page?: number;
  limit?: number;
}
