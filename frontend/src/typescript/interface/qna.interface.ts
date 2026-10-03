export interface IQnAUser {
  _id: string;
  id?: string;
  name: string;
  email?: string;
  profilePicture?: string;
  role?: string;
}

export interface IQnAAnswer {
  _id: string;
  id?: string;
  user: IQnAUser;
  message: string;
  isInstructor: boolean;
  createdAt: string;
}

export interface IQnACourse {
  _id: string;
  id?: string;
  title: string;
  thumbnail?: string;
  slug?: string;
}

export interface IQnAQuestion {
  _id: string;
  id?: string;
  course: string | IQnACourse;
  user: IQnAUser;
  title: string;
  content: string;
  answers: IQnAAnswer[];
  createdAt: string;
  updatedAt: string;
}

export interface InstructorQuestionsData {
  questions: IQnAQuestion[];
  counts: {
    total: number;
    unanswered: number;
    answered: number;
  };
}

export interface CreateQuestionPayload {
  courseId: string;
  title: string;
  content: string;
}

export interface CreateReplyPayload {
  questionId: string;
  message: string;
}
