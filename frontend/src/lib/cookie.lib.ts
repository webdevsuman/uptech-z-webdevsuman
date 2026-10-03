import { deleteCookie, getCookie, setCookie, type OptionsType } from 'cookies-next';

export const getCookieClient = (name: string, options?: OptionsType): string | null => {
  const value = getCookie(name, options);
  if (value === undefined || value === null) return null;
  return String(value);
};

export const setCookieClient = (
  name: string,
  value: string,
  options?: OptionsType
): void => {
  setCookie(name, value, {
    path: '/',
    sameSite: 'lax',
    ...options,
  });
};

export const destroyCookieClient = (name: string, options?: OptionsType): void => {
  deleteCookie(name, {
    path: '/',
    ...options,
  });
};
