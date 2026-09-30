import { configDotenv } from "dotenv";
configDotenv();
import Redis from "ioredis";
import logger from "../utils/logger.js";

const redis = new Redis(process.env.REDIS_URL); //Redis cloud url

redis.on("connect", () => {
  logger.info("Redis connected!");
});

redis.on("ready", () => {
  logger.info("Redis is ready!");
});

redis.on("error", (error) => {
  logger.error("Redis error:", error);
});

redis.on("close", () => {
  logger.info("Redis connection closed.");
});

export default redis;
