import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_APP_BASE_URL: process.env.NEXT_APP_BASE_URL,
    NEXT_APP_TOKEN_NAME: process.env.NEXT_APP_TOKEN_NAME,
    NEXT_APP_REFRESH_TOKEN_NAME: process.env.NEXT_APP_REFRESH_TOKEN_NAME,
    NEXT_APP_ENCRYPTION_KEY_NAME: process.env.NEXT_APP_ENCRYPTION_KEY_NAME,
    NEXT_APP_REMEMBER_ME_KEY_NAME: process.env.NEXT_APP_REMEMBER_ME_KEY_NAME,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/**",
      },
    ],
  },
  /* config options here */
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
    
    turbopack: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  
};

export default nextConfig;
