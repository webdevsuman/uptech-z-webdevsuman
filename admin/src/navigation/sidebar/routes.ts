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
    list: '/users/list',
  },

  courses: {
    list: '/courses/list',
    details: (id: string) => `/courses/details/${id}`,
  },

  categories: {
    list: '/category/list',
    add: '/category/add',
    edit: (id: string) => `/category/edit/${id}`,
  },

  tags: {
    list: '/tags/list',
    add: '/tags/add',
    edit: (id: string) => `/tags/edit/${id}`,
  },

  reviews: {
    list: '/reviews/list',
  },

  cms: {
    homepage: `${EROUTES.cms}/homepage`,
  },
};
