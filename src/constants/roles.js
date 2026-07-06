// Roles must match backend enum exactly (TZ §1).
export const ROLES = {
  CITIZEN: 'citizen',
  WORKER: 'worker',
  ORGANIZATION: 'organization',
  MAHALLA_ADMIN: 'mahalla_admin',
  DISTRICT_ADMIN: 'district_admin',
  REGION_ADMIN: 'region_admin',
  SUPER_ADMIN: 'super_admin',
};

export const ROLE_LABELS = {
  [ROLES.CITIZEN]: 'Fuqaro',
  [ROLES.WORKER]: 'Usta',
  [ROLES.ORGANIZATION]: 'Tashkilot',
  [ROLES.MAHALLA_ADMIN]: 'Mahalla admin',
  [ROLES.DISTRICT_ADMIN]: 'Tuman admin',
  [ROLES.REGION_ADMIN]: 'Viloyat admin',
  [ROLES.SUPER_ADMIN]: 'Super admin',
};

// ─────────────────────────────────────────────────────────────────────────────
// SECURITY: the ONLY roles allowed on the public registration page.
// Admin roles must NEVER be self-assigned — they are created from the Admin
// Panel by an authorized administrator (see ADMIN_CREATABLE_ROLES).
// ─────────────────────────────────────────────────────────────────────────────
export const PUBLIC_REGISTRATION_ROLES = [
  ROLES.CITIZEN,
  ROLES.WORKER,
  ROLES.ORGANIZATION,
];

// Public (self-service) vs internal (admin-created) roles.
export const PUBLIC_ROLES = [ROLES.CITIZEN, ROLES.WORKER, ROLES.ORGANIZATION];
export const ADMIN_ROLES = [
  ROLES.MAHALLA_ADMIN,
  ROLES.DISTRICT_ADMIN,
  ROLES.REGION_ADMIN,
  ROLES.SUPER_ADMIN,
];

export const isAdminRole = (role) => ADMIN_ROLES.includes(role);

// Numeric hierarchy level (higher = more authority). Used to prevent privilege
// escalation: an actor can only manage/create roles strictly below their level.
export const ROLE_LEVEL = {
  [ROLES.CITIZEN]: 0,
  [ROLES.WORKER]: 0,
  [ROLES.ORGANIZATION]: 0,
  [ROLES.MAHALLA_ADMIN]: 1,
  [ROLES.DISTRICT_ADMIN]: 2,
  [ROLES.REGION_ADMIN]: 3,
  [ROLES.SUPER_ADMIN]: 4,
};

// Which admin roles each role may create (admin-creation flow).
// Super → Region → District → Mahalla. No role can create Super Admin.
export const ADMIN_CREATABLE_ROLES = {
  [ROLES.SUPER_ADMIN]: [ROLES.REGION_ADMIN, ROLES.DISTRICT_ADMIN, ROLES.MAHALLA_ADMIN],
  [ROLES.REGION_ADMIN]: [ROLES.DISTRICT_ADMIN],
  [ROLES.DISTRICT_ADMIN]: [ROLES.MAHALLA_ADMIN],
  [ROLES.MAHALLA_ADMIN]: [],
};

// Scope field each admin role must be assigned to when created.
export const ROLE_SCOPE_FIELD = {
  [ROLES.REGION_ADMIN]: 'region',
  [ROLES.DISTRICT_ADMIN]: 'district',
  [ROLES.MAHALLA_ADMIN]: 'mahalla',
};

// Where each role lands after login.
export const ROLE_HOME = {
  [ROLES.CITIZEN]: '/dashboard/citizen',
  [ROLES.WORKER]: '/dashboard/worker',
  [ROLES.ORGANIZATION]: '/dashboard/organization',
  [ROLES.MAHALLA_ADMIN]: '/dashboard/mahalla',
  [ROLES.DISTRICT_ADMIN]: '/dashboard/district',
  [ROLES.REGION_ADMIN]: '/dashboard/region',
  [ROLES.SUPER_ADMIN]: '/dashboard/admin',
};
