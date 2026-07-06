import api, { tokenStore } from '@/api/axiosInstance';
import { ENDPOINTS } from '@/api/endpoints';
import { ENV } from '@/config/env';
import { mockAuth } from './mockAuth';
import { normalizeUser, roleToApi } from '@/api/normalizers';

// Store tokens returned by the backend (Bearer auth) and hand back the user.
const persist = (data = {}) => {
  if (data.accessToken || data.refreshToken) {
    tokenStore.set({ accessToken: data.accessToken, refreshToken: data.refreshToken });
  }
  return data.user ? normalizeUser(data.user) : data;
};

// Real backend (MahallaOS API). camelCase + UPPERCASE roles + Bearer tokens.
const realAuthService = {
  register: ({ full_name, phone, password, role, ...rest }) =>
    api
      .post(ENDPOINTS.AUTH.REGISTER, {
        fullName: full_name,
        phone,
        password,
        role: roleToApi(role),
        ...rest,
      })
      .then((r) => persist(r.data)),

  login: ({ phone, password }) =>
    api.post(ENDPOINTS.AUTH.LOGIN, { phone, password }).then((r) => persist(r.data)),

  logout: () =>
    api
      .post(ENDPOINTS.AUTH.LOGOUT, { refreshToken: tokenStore.refresh })
      .catch(() => {})
      .finally(() => tokenStore.clear()),

  me: () => api.get(ENDPOINTS.AUTH.ME, { suppressErrorToast: true }).then((r) => normalizeUser(r.data)),

  refresh: () =>
    api
      .post(ENDPOINTS.AUTH.REFRESH, { refreshToken: tokenStore.refresh }, { suppressErrorToast: true })
      .then((r) => persist(r.data)),

  sendOtp: (payload) => api.post(ENDPOINTS.AUTH.OTP_SEND, payload).then((r) => r.data),
  verifyOtp: ({ phone, code }) =>
    api.post(ENDPOINTS.AUTH.OTP_VERIFY, { phone, code }).then((r) => persist(r.data)),

  // Not in the backend spec — kept so the demo pages still resolve.
  forgotPassword: (payload) => api.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, payload).then((r) => r.data),
  resetPassword: (payload) => api.post(ENDPOINTS.AUTH.RESET_PASSWORD, payload).then((r) => r.data),
  changePassword: (payload) => api.post(ENDPOINTS.AUTH.CHANGE_PASSWORD, payload).then((r) => r.data),
  verifyEmail: (payload) => api.post(ENDPOINTS.AUTH.VERIFY_EMAIL, payload).then((r) => r.data),
};

// Offline demo mode swaps in the mock backend with the same interface.
export const authService = ENV.MOCK_AUTH ? mockAuth : realAuthService;
