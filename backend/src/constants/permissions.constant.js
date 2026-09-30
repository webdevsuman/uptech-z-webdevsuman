const PERMISSIONS = {
  //Home Assets
  HOME_ASSETS_CREATE: "homeassets:create",
  // Course Management
  COURSE_CREATE: "course:create",
  COURSE_READ_ALL: "course:read_all", // view draft/pending courses
  COURSE_UPDATE: "course:update",
  COURSE_DELETE: "course:delete",
  COURSE_APPROVE: "course:approve", // Admin approval

  // Curriculum & Video Management
  LECTURE_UPLOAD: "lecture:upload",
  LECTURE_DELETE: "lecture:delete",

  // Category & Tags
  CATEGORY_MANAGE: "category:manage",
  TAGS_MANAGE: "tags:manage",

  // Review & Rating Moderation
  REVIEW_CREATE: "review:create",
  REVIEW_MODERATE: "review:moderate",

  // User & Role Administration
  USER_READ: "user:read",
  USER_UPDATE_STATUS: "user:update_status", // block/unblock
  USER_ASSIGN_ROLE: "user:assign_role",
  ROLE_MANAGE: "role:manage",

  // Analytics & Reports
  ANALYTICS_PLATFORM: "analytics:platform",
  ANALYTICS_INSTRUCTOR: "analytics:instructor",
};

export default PERMISSIONS;
