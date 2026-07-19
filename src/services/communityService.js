import api from '@/api/axiosInstance';
import { ENDPOINTS } from '@/api/endpoints';
import { normalizeNotification, normalizeAnnouncement, mapList } from '@/api/normalizers';

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

// Notifications — real backend endpoint (Bearer-protected).
export const notificationService = {
  list: (params) =>
    api.get(ENDPOINTS.NOTIFICATIONS.BASE, { params }).then((r) => mapList(r.data, normalizeNotification)),
  read: (id) => api.patch(ENDPOINTS.NOTIFICATIONS.read(id)).then((r) => r.data),
  readAll: () => api.patch(ENDPOINTS.NOTIFICATIONS.READ_ALL).then((r) => r.data),
};
