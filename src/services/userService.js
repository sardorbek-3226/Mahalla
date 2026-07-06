import api from '@/api/axiosInstance';
import { ENDPOINTS } from '@/api/endpoints';
import { normalizeUser } from '@/api/normalizers';

// Drop empty/undefined fields so optional validators (e.g. @IsEmail) don't
// reject blank strings.
const clean = (obj) =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== '' && v != null));

export const userService = {
  // UpdateUserDto { fullName, email, mahallaId }
  updateMe: ({ full_name, email, mahalla_id }) =>
    api
      .patch(ENDPOINTS.USERS.ME, clean({ fullName: full_name, email, mahallaId: mahalla_id }))
      .then((r) => normalizeUser(r.data)),
  uploadAvatar: (formData) =>
    api
      .post(ENDPOINTS.USERS.AVATAR, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((r) => r.data),
  getById: (id) => api.get(ENDPOINTS.USERS.byId(id)).then((r) => normalizeUser(r.data)),
};
