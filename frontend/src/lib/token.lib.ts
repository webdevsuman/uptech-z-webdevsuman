import {
  accessTokenName,
  refreshTokenName,
  USER_STORAGE_KEY,
} from "@/config/constants";
import {
  destroyCookieClient,
  getCookieClient,
  setCookieClient,
} from "@/lib/cookie.lib";

export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  const cookieVal = getCookieClient(accessTokenName);
  if (cookieVal) return cookieVal;
  return (
    window.localStorage.getItem(accessTokenName) ||
    window.sessionStorage.getItem(accessTokenName)
  );
};

export const getRefreshToken = (): string | null => {
  if (typeof window === "undefined") return null;
  const cookieVal = getCookieClient(refreshTokenName);
  if (cookieVal) return cookieVal;
  return (
    window.localStorage.getItem(refreshTokenName) ||
    window.sessionStorage.getItem(refreshTokenName)
  );
};

export const updateTokens = (
  accessToken: string,
  refreshToken?: string,
): void => {
  if (typeof window === "undefined") return;

  if (accessToken) {
    setCookieClient(accessTokenName, accessToken, {
      maxAge: 60 * 60 * 24, // 1 day
    });
    window.localStorage.setItem(accessTokenName, accessToken);
  }

  if (refreshToken) {
    setCookieClient(refreshTokenName, refreshToken, {
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    window.localStorage.setItem(refreshTokenName, refreshToken);
  }
};

export const setToken = (newToken: string): void => {
  updateTokens(newToken);
};

export const clearTokens = (): void => {
  if (typeof window === "undefined") return;
  destroyCookieClient(accessTokenName);
  destroyCookieClient(refreshTokenName);
  window.localStorage.removeItem(accessTokenName);
  window.localStorage.removeItem(refreshTokenName);
  window.sessionStorage.removeItem(accessTokenName);
  window.sessionStorage.removeItem(refreshTokenName);
};

export const triggerLogout = (): void => {
  clearTokens();
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(USER_STORAGE_KEY);
    window.location.href = "/login";
  }
};
