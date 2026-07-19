// Single source of truth for backend routes (TZ §4).
// If the real backend differs, change ONLY this file + the matching service.
export const ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
    OTP_SEND: '/auth/otp/send',
    OTP_VERIFY: '/auth/otp/verify',
    GOOGLE: '/auth/google',
  },
  REGIONS: {
    BASE: '/regions',
  },
  MAHALLAS: {
    BASE: '/mahallas',
    NEAREST: '/mahallas/nearest',
    byId: (id) => `/mahallas/${id}`,
    announcements: (id) => `/mahallas/${id}/announcements`,
  },
  USERS: {
    BASE: '/users',
    ME: '/users/me',
    AVATAR: '/users/me/avatar',
    byId: (id) => `/users/${id}`,
  },
  WORKERS: {
    BASE: '/providers',
    NEARBY: '/providers/nearby',
    PROFILE: '/providers/profile',
    SERVICES: '/providers/services',
    AVAILABILITY: '/providers/availability',
    DOCUMENTS: '/providers/documents',
    byId: (id) => `/providers/${id}`,
    reviews: (id) => `/providers/${id}/reviews`,
    service: (id) => `/providers/services/${id}`,
  },
  CATEGORIES: {
    BASE: '/categories',
    byId: (id) => `/categories/${id}`,
  },
  BOOKINGS: {
    BASE: '/orders',
    byId: (id) => `/orders/${id}`,
    accept: (id) => `/orders/${id}/accept`,
    status: (id) => `/orders/${id}/status`,
    review: (id) => `/orders/${id}/review`,
  },
  CHAT: {
    CONVERSATIONS: '/conversations',
    messages: (id) => `/conversations/${id}/messages`,
  },
  ANNOUNCEMENTS: {
    BASE: '/announcements',
    byId: (id) => `/announcements/${id}`,
    byMahalla: (id) => `/mahallas/${id}/announcements`,
  },
  NOTIFICATIONS: {
    BASE: '/notifications',
    read: (id) => `/notifications/${id}/read`,
    READ_ALL: '/notifications/read-all',
  },
  UPLOAD: {
    BASE: '/upload',
  },
  ADMIN: {
    STATS: '/admin/stats',
    USERS: '/admin/users',
    PENDING_WORKERS: '/admin/providers/pending',
    verify: (id) => `/admin/providers/${id}/verify`,
    block: (id) => `/admin/users/${id}/block`,
    // RBAC: admin account management + audit trail
    ADMINS: '/admin/admins',
    adminById: (id) => `/admin/admins/${id}`,
    AUDIT: '/admin/audit-logs',
  },
};
