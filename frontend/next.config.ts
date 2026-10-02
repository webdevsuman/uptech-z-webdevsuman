import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_APP_ACCESS_TOKEN_NAME: process.env.NEXT_APP_ACCESS_TOKEN_NAME,
    NEXT_APP_REFRESH_TOKEN_NAME: process.env.NEXT_APP_REFRESH_TOKEN_NAME,
  },
};

export default nextConfig;
