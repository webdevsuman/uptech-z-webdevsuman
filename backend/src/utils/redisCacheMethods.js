import redis from "../config/redisConfig.js";

const getCache = async (key) => {
  try {
    const data = await redis.get(key);
    if (!data) {
      console.log("No data - Redis GET");
      return null;
    }

    return JSON.parse(data);
  } catch (error) {
    console.log("Redis GET error:", error);
    return null;
  }
};

const setCache = async (key, data, expiry = 300) => {
  try {
    await redis.set(key, JSON.stringify(data), "EX", expiry);
    return true;
  } catch (error) {
    console.log("Redis SET error:", error);
    return false;
  }
};

const deleteCache = async (key) => {
  try {
    await redis.del(key);
    return true;
  } catch (error) {
    console.log("Redis delete error:", error);
    return false;
  }
};

export { getCache, setCache, deleteCache };
