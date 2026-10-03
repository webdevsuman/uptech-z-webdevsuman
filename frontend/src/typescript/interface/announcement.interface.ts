export interface IAnnouncementCourse {
  _id: string;
  id?: string;
  title: string;
  thumbnail?: string | { url: string; public_id?: string };
}

export interface IAnnouncement {
  _id: string;
  id?: string;
  instructor: string;
  course: IAnnouncementCourse | string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAnnouncementPayload {
  courseId: string;
  title: string;
  content: string;
}

export interface UpdateAnnouncementPayload {
  id: string;
  title?: string;
  content?: string;
}
