import api from '@/api/axiosInstance';
import { ENDPOINTS } from '@/api/endpoints';
import { normalizeRegion, normalizeMahalla, mapList } from '@/api/normalizers';

// Regions & mahallas (swagger: /regions, /mahallas, /mahallas/nearest).
export const regionService = {
  list: () => api.get(ENDPOINTS.REGIONS.BASE).then((r) => mapList(r.data, normalizeRegion)),
  create: ({ name }) => api.post(ENDPOINTS.REGIONS.BASE, { name }).then((r) => normalizeRegion(r.data)),
};

export const mahallaService = {
  list: (params) => api.get(ENDPOINTS.MAHALLAS.BASE, { params }).then((r) => mapList(r.data, normalizeMahalla)),
  // Returns a single closest match, not a list.
  nearest: (params) => api.get(ENDPOINTS.MAHALLAS.NEAREST, { params }).then((r) => normalizeMahalla(r.data)),
  getById: (id) => api.get(ENDPOINTS.MAHALLAS.byId(id)).then((r) => normalizeMahalla(r.data)),
  create: ({ name, region_id, district, lat, lng }) =>
    api
      .post(ENDPOINTS.MAHALLAS.BASE, { name, regionId: region_id, district, lat, lng })
      .then((r) => normalizeMahalla(r.data)),
  announcements: (id, params) =>
    api.get(ENDPOINTS.MAHALLAS.announcements(id), { params }).then((r) => r.data),
};
