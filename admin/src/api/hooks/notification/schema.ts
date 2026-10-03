import { TAPIResponse } from "@/types/common/common.schema";

export interface INotificationData {
  courseId?: string;
  courseTitle?: string;
  instructorId?: string;
  instructorName?: string;
  instructorAvatar?: string;
  link?: string;
}

export interface INotificationItem {
  _id: string;
  recipientRole: string;
  type: "course_under_review" | "course_approved" | "course_rejected" | "general";
  title: string;
  message: string;
  data?: INotificationData;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface INotificationsPayload {
  notifications: INotificationItem[];
  unreadCount: number;
}

export type TNotificationsResponse = TAPIResponse<INotificationsPayload>;

export type TMarkReadResponse = TAPIResponse<{
  notification: INotificationItem;
  unreadCount: number;
}>;

export type TMarkAllReadResponse = TAPIResponse<{
  unreadCount: number;
}>;
