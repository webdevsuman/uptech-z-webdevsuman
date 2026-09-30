export enum UserRoleEnum {
  ADMIN = 'admin',
  SUB_ADMIN = 'sub-admin',
}

export enum SubjectEnum {
  DASHBOARD = 'dashboard',
  USERS = 'users',
  COURSES = 'courses',
  CATEGORIES = 'categories',
  TAGS = 'tags',
  REVIEWS = 'reviews',
  PROFILE = 'profile',
}


export enum ActionEnum {
  READ = 'read',
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',

  EXPORT = 'export',
  DETAILS = 'details',
  BULK_DELETE = 'bulk-delete',
}
