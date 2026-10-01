import { baseUrlMedia } from '@/lib/constants';

export const mediaUrl = (url: string, path: string = '') => {
  if (!url) return '';
  const trimmed = url.trim();
  if (
    trimmed.startsWith('data:') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('//')
  ) {
    return trimmed;
  }
  const cleanUrl = trimmed.replace(/^\//, '');
  const base = baseUrlMedia.endsWith('/') ? baseUrlMedia : `${baseUrlMedia}/`;
  if (cleanUrl.startsWith('uploads/')) {
    const parentBase = base.replace(/\/uploads\/$/, '/');
    return `${parentBase}${cleanUrl}`;
  }
  const cleanPath = path ? `${path.replace(/\/$/, '')}/` : '';
  return `${base}${cleanPath}${cleanUrl}`;
};

export const endpoints = {
  auth: {
    login: 'auth/login',
    register: 'auth/register',
    sendOtp: 'auth/send-otp',
    verifyOtp: 'auth/verify-otp',
    resendOtp: 'auth/resend-otp',
    'forgot-password': 'auth/forgot-password',
    'reset-password': 'auth/reset-password',
    'refresh-token': 'auth/refresh-token',
    logout: 'auth/logout',
  },
  users: {
    list: 'admin/users',
    details: (id: string) => `admin/users/${id}`,
  },
  courses: {
    list: 'admin/courses',
    details: (id: string) => `admin/courses/${id}`,
  },
  categories: {
    list: 'admin/categories',
    details: (id: string) => `admin/categories/${id}`,
  },
  tags: {
    list: 'admin/tags',
    details: (id: string) => `admin/tags/${id}`,
  },
  reviews: {
    list: 'admin/reviews',
    details: (id: string) => `admin/reviews/${id}`,
  },
  cms: {
    homepage: 'v2/homepage',
  },
};
