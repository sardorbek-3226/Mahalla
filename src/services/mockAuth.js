import { ROLES, PUBLIC_ROLES } from '@/constants/roles';

// ─────────────────────────────────────────────────────────────────────────────
// Offline (mock) auth backend. Active when ENV.MOCK_AUTH is true.
// Persists registered users and the active session in localStorage so the app
// behaves like a real backend (register → OTP → login → session survives reload).
// Drop-in replacement for authService: same method names & return shapes.
// ─────────────────────────────────────────────────────────────────────────────

const USERS_KEY = 'mock_auth_users';
const SESSION_KEY = 'mock_auth_session';
const MOCK_OTP = '123456';
const delay = (ms = 500) => new Promise((r) => setTimeout(r, ms));

const read = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};
const write = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore quota / private-mode errors */
  }
};

const getUsers = () => read(USERS_KEY, []);
const saveUsers = (users) => write(USERS_KEY, users);
const findByPhone = (phone) =>
  getUsers().find((u) => u.phone === normPhone(phone));

const normPhone = (p) => String(p || '').replace(/\s+/g, '');
const uid = () => 'mock-' + Math.random().toString(36).slice(2, 10);

const buildUser = (data) => ({
  id: uid(),
  full_name: data.full_name || 'Foydalanuvchi',
  phone: normPhone(data.phone),
  email: data.email || null,
  role: data.role || ROLES.CITIZEN,
  avatar_url: null,
  mahalla_id: 'mock-mahalla',
  is_phone_verified: false,
  is_active: true,
  created_at: new Date().toISOString(),
});

// Strip the password before returning a user to the app.
const publicUser = ({ password, ...u }) => u;

const setSession = (userId) => write(SESSION_KEY, userId);
const clearSession = () => {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
};

// Reject like axios so callers reading err.response?.data?.message still work.
const reject = (message, status = 400) =>
  Promise.reject({ response: { status, data: { message } } });

export const mockAuth = {
  async register(payload) {
    await delay();
    // SECURITY: public registration can never create an admin account.
    if (payload.role && !PUBLIC_ROLES.includes(payload.role)) {
      return reject('Ruxsat etilmagan rol', 403);
    }
    if (findByPhone(payload.phone)) {
      return reject('Bu telefon raqami allaqachon ro‘yxatdan o‘tgan');
    }
    const user = { ...buildUser(payload), password: payload.password };
    const users = getUsers();
    users.push(user);
    saveUsers(users);
    return { user: publicUser(user) };
  },

  async sendOtp() {
    await delay(300);
    // Any 6-digit code is accepted; demo code is 123456.
    return { success: true, devCode: MOCK_OTP };
  },

  async verifyOtp({ phone }) {
    await delay();
    const users = getUsers();
    const idx = users.findIndex((u) => u.phone === normPhone(phone));
    if (idx === -1) return reject('Foydalanuvchi topilmadi', 404);
    users[idx].is_phone_verified = true;
    saveUsers(users);
    setSession(users[idx].id);
    return { user: publicUser(users[idx]) };
  },

  async login({ phone, password, role }) {
    await delay();
    const users = getUsers();
    let user = users.find((u) => u.phone === normPhone(phone));
    // Convenience for demo: if the phone isn't registered, provision a user on
    // the fly with the chosen role so login always succeeds without a backend.
    if (!user) {
      user = {
        ...buildUser({ phone, full_name: 'Demo Foydalanuvchi', role }),
        password,
        is_phone_verified: true,
      };
      users.push(user);
    } else if (role) {
      // Demo: allow switching the panel by picking a role at login.
      user.role = role;
    }
    saveUsers(users);
    setSession(user.id);
    return { user: publicUser(user) };
  },

  async me() {
    const sessionId = read(SESSION_KEY, null);
    if (!sessionId) return reject('Sessiya yo‘q', 401);
    const user = getUsers().find((u) => u.id === sessionId);
    if (!user) return reject('Sessiya yo‘q', 401);
    return { user: publicUser(user) };
  },

  async logout() {
    await delay(150);
    clearSession();
    return { success: true };
  },

  async refresh() {
    return { success: true };
  },

  async forgotPassword() {
    await delay();
    return { success: true };
  },

  async resetPassword() {
    await delay();
    return { success: true };
  },

  async changePassword() {
    await delay();
    return { success: true };
  },

  async verifyEmail() {
    await delay();
    return { success: true };
  },
};
