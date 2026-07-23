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
  // suppressErrorToast: the calling page already shows its own contextual
  // error message, so the global interceptor toast is skipped here to avoid
  // showing the same error twice.
  register: ({ full_name, phone, password, role, ...rest }) =>
    api
      .post(
        ENDPOINTS.AUTH.REGISTER,
        { fullName: full_name, phone, password, role: roleToApi(role), ...rest },
        { suppressErrorToast: true }
      )
      .then((r) => persist(r.data)),

  login: ({ phone, password }) =>
    api
      .post(ENDPOINTS.AUTH.LOGIN, { phone, password }, { suppressErrorToast: true })
      .then((r) => persist(r.data)),

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

  sendOtp: (payload) =>
    api.post(ENDPOINTS.AUTH.OTP_SEND, payload, { suppressErrorToast: true }).then((r) => r.data),
  verifyOtp: ({ phone, code }) =>
    api
      .post(ENDPOINTS.AUTH.OTP_VERIFY, { phone, code }, { suppressErrorToast: true })
      .then((r) => persist(r.data)),
};

// Offline demo mode swaps in the mock backend with the same interface.
export const authService = ENV.MOCK_AUTH ? mockAuth : realAuthService;
