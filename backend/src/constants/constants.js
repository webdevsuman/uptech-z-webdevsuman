import { configDotenv } from "dotenv";
configDotenv();

export const jwtSecret = process.env.JWT_SECRET;
export const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;

export const frontendUrl =
  process.env.FRONTEND_BASE_URL || "http://localhost:3000";
