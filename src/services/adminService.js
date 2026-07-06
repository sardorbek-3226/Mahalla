import api from '@/api/axiosInstance';
import { ENDPOINTS } from '@/api/endpoints';
import { normalizeUser, normalizeProvider, mapList } from '@/api/normalizers';
import { db, save, newId } from '@/services/mock/db';

export const adminService = {
  stats: () => api.get(ENDPOINTS.ADMIN.STATS).then((r) => r.data),
  users: (params) => api.get(ENDPOINTS.ADMIN.USERS, { params }).then((r) => mapList(r.data, normalizeUser)),
  pendingWorkers: (params) =>
    api.get(ENDPOINTS.ADMIN.PENDING_WORKERS, { params }).then((r) => mapList(r.data, normalizeProvider)),
  // VerifyProviderDto { status } — backend expects UPPERCASE (VERIFIED / REJECTED).
  verifyWorker: (id, status) =>
    api.patch(ENDPOINTS.ADMIN.verify(id), { status: String(status).toUpperCase() }).then((r) => r.data),
  // BlockUserDto { block }
  blockUser: (id, blocked) =>
    api.patch(ENDPOINTS.ADMIN.block(id), { block: blocked }).then((r) => r.data),

  // RBAC: admin account management + audit (no backend endpoint yet — local demo).
  listAdmins: () => Promise.resolve({ items: db.admins }),
  createAdmin: (payload) => {
    const admin = { id: newId('adm'), is_active: true, created_at: new Date().toISOString(), ...payload };
    db.admins.unshift(admin);
    db.auditLogs.unshift({
      id: newId('log'),
      actor: payload.actor || 'Administrator',
      actor_role: payload.actor_role || null,
      action: 'admin.create',
      meta: { role: payload.role, scope: payload.scope },
      created_at: new Date().toISOString(),
    });
    save();
    return Promise.resolve(admin);
  },
  suspendAdmin: (id) => {
    const a = db.admins.find((x) => x.id === id);
    if (a) { a.is_active = false; save(); }
    return Promise.resolve({ success: true });
  },
};
