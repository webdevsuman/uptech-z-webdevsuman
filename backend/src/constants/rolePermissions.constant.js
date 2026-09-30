import ROLES from "./roles.constant.js";
import PERMISSIONS from "./permissions.constant.js";

export const ROLE_PERMISSIONS = {
  [ROLES.STUDENT]: [
    PERMISSIONS.REVIEW_CREATE,
    // Add student specific permissions here
  ],

  [ROLES.INSTRUCTOR]: [
    PERMISSIONS.COURSE_CREATE,
    PERMISSIONS.COURSE_UPDATE,
    PERMISSIONS.COURSE_DELETE,
    PERMISSIONS.LECTURE_UPLOAD,
    PERMISSIONS.LECTURE_DELETE,
    PERMISSIONS.ANALYTICS_INSTRUCTOR,
    PERMISSIONS.REVIEW_CREATE,
  ],

  [ROLES.SUB_ADMIN]: [],

  // Super Admin will have ALL permissions mapped in the seed script
  [ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS),
};
