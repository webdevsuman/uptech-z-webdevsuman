export const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

export const accessTokenName =
  process.env.NEXT_APP_ACCESS_TOKEN_NAME || "uptechz_frontend_access_token";
export const refreshTokenName =
  process.env.NEXT_APP_REFRESH_TOKEN_NAME || "uptechz_frontend_refresh_token";

export const allowedImageTypes = [
  "image/png",
  "image/jpg",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
];
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB limit
export const MAX_MEDIA_SIZE = 100 * 1024 * 1024; // 100MB limit

export const USER_STORAGE_KEY = "uptechz_frontend_user";
