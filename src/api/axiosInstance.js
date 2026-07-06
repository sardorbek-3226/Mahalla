import axios from 'axios';
import toast from 'react-hot-toast';
import { ENV } from '@/config/env';
import { ENDPOINTS } from './endpoints';
import mockAdapter from '@/services/mock/mockAdapter';

// ─────────────────────────────────────────────────────────────────────────────
// Token store. The real MahallaOS backend is Bearer-token based (it returns
// accessToken/refreshToken in the body, NOT HTTP-only cookies). We persist them
// in localStorage and attach Authorization on every request.
// ─────────────────────────────────────────────────────────────────────────────
const AT_KEY = 'mh_access_token';
const RT_KEY = 'mh_refresh_token';

export const tokenStore = {
  get access() {
    try { return localStorage.getItem(AT_KEY); } catch { return null; }
  },
  get refresh() {
    try { return localStorage.getItem(RT_KEY); } catch { return null; }
  },
  set({ accessToken, refreshToken } = {}) {
    try {
      if (accessToken) localStorage.setItem(AT_KEY, accessToken);
      if (refreshToken) localStorage.setItem(RT_KEY, refreshToken);
    } catch { /* ignore */ }
  },
  clear() {
    try { localStorage.removeItem(AT_KEY); localStorage.removeItem(RT_KEY); } catch { /* ignore */ }
  },
};

const api = axios.create({
  baseURL: ENV.API_URL,
  withCredentials: true, // harmless; backend uses Bearer but keep for cookie setups
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

// Offline demo mode: serve every request from the in-memory mock DB.
if (ENV.MOCK_AUTH) {
  api.defaults.adapter = mockAdapter;
}

// --- Request interceptor: attach Bearer token (real mode) --------------------
api.interceptors.request.use(
  (config) => {
    if (!ENV.MOCK_AUTH) {
      const token = tokenStore.access;
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- Refresh-token handling (single-flight) ----------------------------------
let isRefreshing = false;
let pendingQueue = [];
const flushQueue = (error) => {
  pendingQueue.forEach(({ resolve, reject }) => (error ? reject(error) : resolve()));
  pendingQueue = [];
};

let onUnauthenticated = null;
export const registerUnauthHandler = (fn) => {
  onUnauthenticated = fn;
};

// Unwrap the standard { success, data, meta } envelope so callers/components get
// either the plain object or a { items, ...meta } list. Mock responses (which
// have no `success` key) pass through untouched.
const unwrapEnvelope = (response) => {
  const body = response.data;
  if (body && typeof body === 'object' && 'success' in body && 'data' in body) {
    if (Array.isArray(body.data)) {
      response.data = { items: body.data, ...(body.meta || {}), unread: body.unread };
    } else {
      response.data = body.data;
    }
  }
  return response;
};

// --- Response interceptor ----------------------------------------------------
api.interceptors.response.use(
  (response) => unwrapEnvelope(response),
  async (error) => {
    const original = error.config;
    const status = error.response?.status;
    const silent = original?.suppressErrorToast;

    if (!error.response) {
      if (!silent && !ENV.MOCK_AUTH) {
        toast.error('Tarmoq xatosi. Internet aloqasini tekshiring.');
      }
      return Promise.reject(error);
    }

    const isAuthCall =
      original?.url?.includes(ENDPOINTS.AUTH.LOGIN) ||
      original?.url?.includes(ENDPOINTS.AUTH.REFRESH);

    if (status === 401 && !original._retry && !isAuthCall && !ENV.MOCK_AUTH && tokenStore.refresh) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject });
        }).then(() => api(original));
      }

      original._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = tokenStore.refresh;
        if (!refreshToken) throw new Error('no refresh token');
        const res = await api.post(
          ENDPOINTS.AUTH.REFRESH,
          { refreshToken },
          { suppressErrorToast: true }
        );
        // res.data is already unwrapped to the inner payload.
        tokenStore.set({
          accessToken: res.data?.accessToken,
          refreshToken: res.data?.refreshToken,
        });
        flushQueue(null);
        return api(original);
      } catch (refreshError) {
        flushQueue(refreshError);
        tokenStore.clear();
        onUnauthenticated?.();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      'Kutilmagan xatolik yuz berdi.';

    if (!silent) {
      if (status === 403) toast.error("Bu amal uchun ruxsatingiz yo'q.");
      else if (status >= 500) toast.error('Server xatosi. Keyinroq urinib ko‘ring.');
      else if (status !== 401) toast.error(Array.isArray(message) ? message[0] : message);
    }

    return Promise.reject(error);
  }
);

export default api;
