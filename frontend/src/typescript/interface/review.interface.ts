export interface IReviewStudent {
  _id: string;
  name: string;
  profilePicture?: string;
  email?: string;
}

export interface IReview {
  _id: string;
  student: IReviewStudent;
  course: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface IReviewStats {
  avgRating: number;
  totalReviews: number;
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  distributionPercentages: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export interface ICourseReviewsData {
  reviews: IReview[];
  stats: IReviewStats;
}

export interface IReviewEligibility {
  canReview: boolean;
  isEnrolled: boolean;
  isInstructor: boolean;
  existingReview: IReview | null;
}

export interface IEnrollmentStatus {
  isEnrolled: boolean;
  isInstructor: boolean;
}

export interface IWishlistStatus {
  isWishlisted: boolean;
}
