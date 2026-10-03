import React from "react";
import Badge from "@/components/ui/badge/Badge";
import { TCourseStatus } from "@/api/hooks/course/schema";

interface CourseStatusBadgeProps {
  status: TCourseStatus;
}

export const CourseStatusBadge: React.FC<CourseStatusBadgeProps> = ({ status }) => {
  switch (status) {
    case "published":
      return (
        <Badge variant="light" color="success" size="sm">
          Published
        </Badge>
      );
    case "under_review":
      return (
        <Badge variant="light" color="warning" size="sm">
          Under Review
        </Badge>
      );
    case "rejected":
      return (
        <Badge variant="light" color="error" size="sm">
          Rejected
        </Badge>
      );
    case "draft":
    default:
      return (
        <Badge variant="light" color="light" size="sm">
          Draft
        </Badge>
      );
  }
};

export default CourseStatusBadge;
