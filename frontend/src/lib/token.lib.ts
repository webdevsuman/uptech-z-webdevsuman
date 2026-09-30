import { accessTokenName } from "@/config/constants";
import { getCookie, setCookie } from "cookies-next";

export const getToken = () =>
  getCookie(accessTokenName) ||
  window.localStorage.getItem(accessTokenName) ||
  window.sessionStorage.getItem(accessTokenName);

// Helper to save new token back to where it came from
export const setToken = (newToken: string) => {
  if (window.localStorage.getItem(accessTokenName)) {
    window.localStorage.setItem(accessTokenName, newToken);
  } else if (window.sessionStorage.getItem(accessTokenName)) {
    window.sessionStorage.setItem(accessTokenName, newToken);
  } else {
    setCookie(accessTokenName, newToken);
  }
};
