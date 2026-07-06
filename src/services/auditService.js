import { db, save, newId } from '@/services/mock/db';

// Audit trail. No backend endpoint yet — served from local demo data so the
// Audit Logs page works. Real backend would record this server-side.
export const auditService = {
  list: () => Promise.resolve({ items: db.auditLogs }),
  log: (action, meta = {}) => {
    const entry = { id: newId('log'), actor: 'Administrator', actor_role: null, action, meta, created_at: new Date().toISOString() };
    db.auditLogs.unshift(entry);
    save();
    return Promise.resolve(entry);
  },
};
