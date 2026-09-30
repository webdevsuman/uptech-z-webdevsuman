import { getCache, setCache, deleteCache } from "../utils/redisCacheMethods.js";

const getOtpKey = (userId) => `user:otp:${userId}`;

const getOtpCache = async (userId) => {
  return await getCache(getOtpKey(userId));
};

const setOtpCache = async (userId, otpCode) => {
  return await setCache(getOtpKey(userId), otpCode, 300); //300 seconds  = 5min
};

const deleteOtpCache = async (userId) => {
  return await deleteCache(getOtpKey(userId));
};

export { getOtpCache, setOtpCache, deleteOtpCache };
