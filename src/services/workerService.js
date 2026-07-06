import api from '@/api/axiosInstance';
import { ENDPOINTS } from '@/api/endpoints';
import { normalizeProvider, normalizeCategory, normalizeReview, normalizeDocument, mapList } from '@/api/normalizers';

// Map UI filter params → backend query params (swagger: providers GET).
const toQuery = (p = {}) => ({
  page: p.page,
  limit: p.limit,
  categoryId: p.category_id || p.categoryId,
  mahallaId: p.mahalla_id || p.mahallaId,
  available: p.available,
  verifiedOnly: p.verifiedOnly,
  minRating: p.minRating,
  search: p.q || p.search,
});

export const workerService = {
  list: (params) =>
    api.get(ENDPOINTS.WORKERS.BASE, { params: toQuery(params) }).then((r) => mapList(r.data, normalizeProvider)),
  nearby: (params) =>
    api.get(ENDPOINTS.WORKERS.NEARBY, { params }).then((r) => mapList(r.data, normalizeProvider)),
  getById: (id) => api.get(ENDPOINTS.WORKERS.byId(id)).then((r) => normalizeProvider(r.data)),
  reviews: (id, params) =>
    api.get(ENDPOINTS.WORKERS.reviews(id), { params }).then((r) => mapList(r.data, normalizeReview)),
  upsertProfile: ({ bio, experience_years }) =>
    api.post(ENDPOINTS.WORKERS.PROFILE, { bio, experienceYears: experience_years }).then((r) => r.data),
  addService: ({ category_id, title, description, price_from, price_unit }) =>
    api
      .post(ENDPOINTS.WORKERS.SERVICES, {
        categoryId: category_id,
        title,
        description,
        priceFrom: price_from,
        priceUnit: price_unit,
      })
      .then((r) => r.data),
  updateService: (id, { title, description, price_from, price_unit }) =>
    api
      .patch(ENDPOINTS.WORKERS.service(id), { title, description, priceFrom: price_from, priceUnit: price_unit })
      .then((r) => r.data),
  deleteService: (id) => api.delete(ENDPOINTS.WORKERS.service(id)).then((r) => r.data),
  setAvailability: (isAvailable) =>
    api.patch(ENDPOINTS.WORKERS.AVAILABILITY, { isAvailable }).then((r) => r.data),
  listDocuments: () => api.get(ENDPOINTS.WORKERS.DOCUMENTS).then((r) => mapList(r.data, normalizeDocument)),
  uploadDocument: (formData) =>
    api
      .post(ENDPOINTS.WORKERS.DOCUMENTS, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((r) => r.data),
};

export const categoryService = {
  list: () => api.get(ENDPOINTS.CATEGORIES.BASE).then((r) => mapList(r.data, normalizeCategory)),
  create: ({ name, slug, icon_url, parent_id }) =>
    api.post(ENDPOINTS.CATEGORIES.BASE, { name, slug, iconUrl: icon_url, parentId: parent_id }).then((r) => normalizeCategory(r.data)),
  update: (id, { name, slug, icon_url }) =>
    api.patch(ENDPOINTS.CATEGORIES.byId(id), { name, slug, iconUrl: icon_url }).then((r) => normalizeCategory(r.data)),
  remove: (id) => api.delete(ENDPOINTS.CATEGORIES.byId(id)).then((r) => r.data),
};
