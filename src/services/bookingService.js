import api from '@/api/axiosInstance';
import { ENDPOINTS } from '@/api/endpoints';
import { normalizeOrder, mapList } from '@/api/normalizers';

// Backend order status enum is UPPERCASE (NEW / ACCEPTED / IN_PROGRESS / …).
const toApiStatus = (s) => String(s || '').toUpperCase();

export const bookingService = {
  list: (params) =>
    api.get(ENDPOINTS.BOOKINGS.BASE, { params }).then((r) => mapList(r.data, normalizeOrder)),
  getById: (id) => api.get(ENDPOINTS.BOOKINGS.byId(id)).then((r) => normalizeOrder(r.data)),
  create: ({ title, description, address, category_id, worker_id, scheduled_at }) =>
    api
      .post(ENDPOINTS.BOOKINGS.BASE, {
        title,
        description,
        address,
        categoryId: category_id,
        providerId: worker_id || undefined,
        scheduledAt: scheduled_at || undefined,
      })
      .then((r) => normalizeOrder(r.data)),
  // AcceptOrderDto requires priceAgreed — the worker sets it when claiming the job.
  accept: (id, priceAgreed) =>
    api.patch(ENDPOINTS.BOOKINGS.accept(id), { priceAgreed: Number(priceAgreed) }).then((r) => normalizeOrder(r.data)),
  updateStatus: (id, status) =>
    api.patch(ENDPOINTS.BOOKINGS.status(id), { status: toApiStatus(status) }).then((r) => r.data),
  cancel: (id) => api.delete(ENDPOINTS.BOOKINGS.byId(id)).then((r) => r.data),
  review: (id, { rating, comment }) =>
    api.post(ENDPOINTS.BOOKINGS.review(id), { rating, comment }).then((r) => r.data),
};
