import { ROLES } from './roles';

// ─────────────────────────────────────────────────────────────────────────────
// Permission catalogue. Every protected action maps to a permission key.
// The backend is the source of truth; the frontend mirrors this matrix to hide
// unauthorized UI and block unauthorized routes (defence in depth).
// ─────────────────────────────────────────────────────────────────────────────
export const PERMISSIONS = {
  // Common (public users)
  PROFILE_EDIT: 'profile.edit',
  WORKERS_SEARCH: 'workers.search',
  BOOKINGS_CREATE: 'bookings.create',
  PAYMENTS_MAKE: 'payments.make',
  COMPLAINTS_SUBMIT: 'complaints.submit',
  REVIEWS_CREATE: 'reviews.create',
  NOTIFICATIONS_RECEIVE: 'notifications.receive',

  // Worker
  WORKER_PROFILE_MANAGE: 'worker.profile.manage',
  WORKER_SERVICES_MANAGE: 'worker.services.manage',
  BOOKINGS_ACCEPT: 'bookings.accept',
  JOBS_COMPLETE: 'jobs.complete',
  EARNINGS_VIEW: 'earnings.view',

  // Organization
  ORG_PROFILE_MANAGE: 'org.profile.manage',
  JOBS_CREATE: 'jobs.create',
  WORKERS_HIRE: 'workers.hire',
  REPORTS_VIEW: 'reports.view',

  // Admin panel
  ADMIN_PANEL_ACCESS: 'admin.panel.access',
  CITIZENS_MANAGE: 'citizens.manage',
  WORKERS_VERIFY: 'workers.verify',
  COMPLAINTS_MANAGE: 'complaints.manage',
  NEWS_PUBLISH: 'news.publish',
  REPORTS_LOCAL_VIEW: 'reports.local.view',

  // District / Region
  MAHALLA_ADMINS_MANAGE: 'mahalla_admins.manage',
  DISTRICT_STATS_VIEW: 'district.stats.view',
  DISTRICT_ADMINS_MANAGE: 'district_admins.manage',
  REGION_STATS_VIEW: 'region.stats.view',
  REPORTS_GENERATE: 'reports.generate',
  MAHALLAS_MONITOR: 'mahallas.monitor',

  // Admin creation (privilege-sensitive)
  CREATE_REGION_ADMIN: 'create.region_admin',
  CREATE_DISTRICT_ADMIN: 'create.district_admin',
  CREATE_MAHALLA_ADMIN: 'create.mahalla_admin',
  ROLES_ASSIGN: 'roles.assign',
  ROLES_MANAGE: 'roles.manage',

  // Super admin
  USERS_MANAGE: 'users.manage',
  ACCOUNTS_SUSPEND: 'accounts.suspend',
  ACCOUNTS_DELETE: 'accounts.delete',
  AUDIT_LOGS_VIEW: 'audit.logs.view',
  PLATFORM_SETTINGS_MANAGE: 'platform.settings.manage',
  PERMISSIONS_MANAGE: 'permissions.manage',
  SYSTEM_MONITOR: 'system.monitor',
};

const P = PERMISSIONS;

// Building blocks (composed into role grants below).
const CITIZEN_PERMS = [
  P.PROFILE_EDIT, P.WORKERS_SEARCH, P.BOOKINGS_CREATE, P.PAYMENTS_MAKE,
  P.COMPLAINTS_SUBMIT, P.REVIEWS_CREATE, P.NOTIFICATIONS_RECEIVE,
];

const WORKER_PERMS = [
  P.PROFILE_EDIT, P.NOTIFICATIONS_RECEIVE,
  P.WORKER_PROFILE_MANAGE, P.WORKER_SERVICES_MANAGE,
  P.BOOKINGS_ACCEPT, P.JOBS_COMPLETE, P.EARNINGS_VIEW,
];

const ORGANIZATION_PERMS = [
  P.PROFILE_EDIT, P.NOTIFICATIONS_RECEIVE, P.WORKERS_SEARCH,
  P.ORG_PROFILE_MANAGE, P.JOBS_CREATE, P.WORKERS_HIRE, P.REPORTS_VIEW,
];

const MAHALLA_ADMIN_PERMS = [
  P.ADMIN_PANEL_ACCESS, P.NOTIFICATIONS_RECEIVE,
  P.CITIZENS_MANAGE, P.WORKERS_VERIFY, P.COMPLAINTS_MANAGE,
  P.NEWS_PUBLISH, P.REPORTS_LOCAL_VIEW,
];

const DISTRICT_ADMIN_PERMS = [
  ...MAHALLA_ADMIN_PERMS,
  P.MAHALLA_ADMINS_MANAGE, P.DISTRICT_STATS_VIEW, P.REPORTS_GENERATE,
  P.MAHALLAS_MONITOR, P.CREATE_MAHALLA_ADMIN, P.ROLES_ASSIGN,
];

const REGION_ADMIN_PERMS = [
  ...DISTRICT_ADMIN_PERMS,
  P.DISTRICT_ADMINS_MANAGE, P.REGION_STATS_VIEW, P.CREATE_DISTRICT_ADMIN,
];

// Super admin = everything.
const SUPER_ADMIN_PERMS = Object.values(PERMISSIONS);

export const ROLE_PERMISSIONS = {
  [ROLES.CITIZEN]: CITIZEN_PERMS,
  [ROLES.WORKER]: WORKER_PERMS,
  [ROLES.ORGANIZATION]: ORGANIZATION_PERMS,
  [ROLES.MAHALLA_ADMIN]: MAHALLA_ADMIN_PERMS,
  [ROLES.DISTRICT_ADMIN]: DISTRICT_ADMIN_PERMS,
  [ROLES.REGION_ADMIN]: REGION_ADMIN_PERMS,
  [ROLES.SUPER_ADMIN]: SUPER_ADMIN_PERMS,
};

// Core check: does this role grant this permission?
export const roleHas = (role, permission) =>
  (ROLE_PERMISSIONS[role] || []).includes(permission);

export const userCan = (user, permission) => !!user && roleHas(user.role, permission);
