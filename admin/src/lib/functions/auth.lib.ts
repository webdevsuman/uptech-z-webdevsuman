import { accessTokenKey, refreshTokenKey } from '@/lib/constants';
import { ROUTES } from '@/navigation/sidebar/routes';
import {
  destroyCookieClient,
  getCookieClient,
  setCookieClient,
} from './cookie.lib';

export const getToken = (): string | null => {
  return getCookieClient(accessTokenKey || 'admin_access_token');
};

export const getRefreshToken = (): string | null => {
  return getCookieClient(refreshTokenKey || 'admin_refresh_token');
};

export const updateTokens = (accessToken: string, refreshToken?: string): void => {
  if (accessToken) {
    // 1 day expiration (in seconds)
    setCookieClient(accessTokenKey || 'admin_access_token', accessToken, {
      maxAge: 60 * 60 * 24,
    });
  }
  if (refreshToken) {
    // 7 days expiration (in seconds)
    setCookieClient(refreshTokenKey || 'admin_refresh_token', refreshToken, {
      maxAge: 60 * 60 * 24 * 7,
    });
  }
};

export const clearTokens = (): void => {
  destroyCookieClient(accessTokenKey || 'admin_access_token');
  destroyCookieClient(refreshTokenKey || 'admin_refresh_token');
};

export const triggerLogout = (): void => {
  clearTokens();
  if (typeof window !== 'undefined') {
    window.location.href = ROUTES.auth.login;
  }
};
