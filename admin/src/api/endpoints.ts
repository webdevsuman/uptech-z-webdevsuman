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
    list: 'users',
    details: (id: string) => `users/${id}`,
  },
  courses: {
    list: 'courses',
    listAdmin: 'courses/admin',
    details: (id: string) => `courses/${id}`,
    updateStatus: (id: string) => `courses/${id}/status`,
    toggleFeatured: (id: string) => `courses/${id}/featured`,
    toggleTrending: (id: string) => `courses/${id}/trending`,
    delete: (id: string) => `courses/${id}`,
  },
  categories: {
    list: 'categories',
    details: (id: string) => `categories/${id}`,
  },
  tags: {
    list: 'tags',
    details: (id: string) => `tags/${id}`,
  },
  reviews: {
    list: 'reviews',
    details: (id: string) => `reviews/${id}`,
  },
  analytics: {
    dashboard: 'analytics/dashboard',
  },
  notifications: {
    list: 'notifications',
    markRead: (id: string) => `notifications/${id}/read`,
    markAllRead: 'notifications/read-all',
    delete: (id: string) => `notifications/${id}`,
    deleteAll: 'notifications/clear-all',
  },
  cms: {
    homepage: 'v2/homepage',
  },
};
