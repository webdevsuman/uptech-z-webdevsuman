import { accessTokenName, refreshTokenName, USER_STORAGE_KEY } from "@/config/constants";
import { deleteCookie, getCookie, setCookie } from "cookies-next";

export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  const cookieVal = getCookie(accessTokenName);
  if (cookieVal) return String(cookieVal);
  return window.localStorage.getItem(accessTokenName) || window.sessionStorage.getItem(accessTokenName);
};

export const getRefreshToken = (): string | null => {
  if (typeof window === "undefined") return null;
  const cookieVal = getCookie(refreshTokenName);
  if (cookieVal) return String(cookieVal);
  return window.localStorage.getItem(refreshTokenName) || window.sessionStorage.getItem(refreshTokenName);
};

export const updateTokens = (accessToken: string, refreshToken?: string): void => {
  if (typeof window === "undefined") return;

  if (accessToken) {
    setCookie(accessTokenName, accessToken, {
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
      sameSite: "lax",
    });
    window.localStorage.setItem(accessTokenName, accessToken);
  }

  if (refreshToken) {
    setCookie(refreshTokenName, refreshToken, {
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
      sameSite: "lax",
    });
    window.localStorage.setItem(refreshTokenName, refreshToken);
  }
};

export const setToken = (newToken: string): void => {
  updateTokens(newToken);
};

export const clearTokens = (): void => {
  if (typeof window === "undefined") return;
  deleteCookie(accessTokenName, { path: "/" });
  deleteCookie(refreshTokenName, { path: "/" });
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
