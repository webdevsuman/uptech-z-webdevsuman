import { uiURL } from '@/lib/constants';
import { EROUTES } from '@/navigation/sidebar/constants';
export { EROUTES } from '@/navigation/sidebar/constants';

export const ROUTES = {
  'ui-url': uiURL || 'http://localhost:3000',

  dashboard: '/',

  auth: {
    login: `${EROUTES.auth}/signin`,
    signup: `${EROUTES.auth}/signup`,
    'forgot-password': `${EROUTES.auth}/forgot-password`,
    'reset-password': `${EROUTES.auth}/reset-password`,
  },

  profile: {
    profile: `${EROUTES.profile}`,
  },

  // UpTech-Z LMS Modules
  users: {
    list: '/users',
  },

  courses: {
    list: '/courses',
  },

  categories: {
    list: '/categories',
  },

  tags: {
    list: '/tags',
  },

  reviews: {
    list: '/reviews',
  },

  cms: {
    homepage: `${EROUTES.cms}/homepage`,
  },
};
