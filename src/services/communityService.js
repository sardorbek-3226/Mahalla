import api from '@/api/axiosInstance';
import { ENDPOINTS } from '@/api/endpoints';
import { normalizeNotification, normalizeAnnouncement, mapList } from '@/api/normalizers';
import { db, save, newId } from '@/services/mock/db';

// ─────────────────────────────────────────────────────────────────────────────
// The MahallaOS backend does not (yet) expose endpoints for events, complaints,
// payments or a global reviews feed. Those features are served from local demo
// data so the UI keeps working. Notifications use the real endpoint.
// ─────────────────────────────────────────────────────────────────────────────
const local = (rows) => Promise.resolve({ items: rows });

// News / announcements — real backend (per-mahalla). Needs the user's mahalla id.
export const newsService = {
  list: (mahallaId, params) =>
    mahallaId
      ? api.get(ENDPOINTS.MAHALLAS.announcements(mahallaId), { params }).then((r) => mapList(r.data, normalizeAnnouncement))
      : Promise.resolve({ items: [] }),
  create: ({ title, body, type, mahalla_id }) =>
    api
      .post(ENDPOINTS.ANNOUNCEMENTS.BASE, { title, body, type, mahallaId: mahalla_id })
      .then((r) => normalizeAnnouncement(r.data)),
  remove: (id) => api.delete(ENDPOINTS.ANNOUNCEMENTS.byId(id)).then((r) => r.data),
};

export const eventService = {
  list: () => local(db.events),
};

export const complaintService = {
  list: () => local(db.complaints),
  create: (payload) => {
    const c = { id: newId('cmp'), status: 'new', created_at: new Date().toISOString(), ...payload };
    db.complaints.unshift(c);
    save();
    return Promise.resolve(c);
  },
};

export const paymentService = {
  list: () => local(db.payments),
};

export const reviewService = {
  listAll: () => local(db.reviews),
  byWorker: (id, params) =>
    api.get(ENDPOINTS.WORKERS.reviews(id), { params }).then((r) => r.data),
};

// Notifications — real backend endpoint (Bearer-protected).
export const notificationService = {
  list: (params) =>
    api.get(ENDPOINTS.NOTIFICATIONS.BASE, { params }).then((r) => mapList(r.data, normalizeNotification)),
  read: (id) => api.patch(ENDPOINTS.NOTIFICATIONS.read(id)).then((r) => r.data),
  readAll: () => api.patch(ENDPOINTS.NOTIFICATIONS.READ_ALL).then((r) => r.data),
};
