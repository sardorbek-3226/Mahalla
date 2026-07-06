import { useSelector } from 'react-redux';
import { roleHas, ROLE_PERMISSIONS } from '@/constants/permissions';
import {
  ADMIN_CREATABLE_ROLES,
  ROLE_LEVEL,
  isAdminRole,
} from '@/constants/roles';

// Central authorization hook. Mirrors backend RBAC so the UI can hide
// unauthorized actions. NEVER the sole gate — the API re-checks everything.
export const usePermissions = () => {
  const user = useSelector((s) => s.auth.user);
  const role = user?.role;

  const can = (permission) => roleHas(role, permission);
  const canAny = (...perms) => perms.some((p) => roleHas(role, p));
  const canAll = (...perms) => perms.every((p) => roleHas(role, p));
  const hasRole = (...roles) => roles.includes(role);

  // Roles this user is allowed to create (admin-creation flow).
  const creatableRoles = ADMIN_CREATABLE_ROLES[role] || [];

  // Privilege-escalation guard: can the actor act on a target role?
  // Only strictly-lower levels, and never on a Super Admin.
  const canManageRole = (targetRole) =>
    (ROLE_LEVEL[role] ?? -1) > (ROLE_LEVEL[targetRole] ?? -1);

  return {
    user,
    role,
    can,
    canAny,
    canAll,
    hasRole,
    isAdmin: isAdminRole(role),
    creatableRoles,
    canManageRole,
    permissions: ROLE_PERMISSIONS[role] || [],
  };
};
