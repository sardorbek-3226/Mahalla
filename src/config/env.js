// Centralized access to Vite env vars. Never read import.meta.env elsewhere.
// Fallbacks point at the real deployed backend (not localhost) so the app still
// works if VITE_API_URL/VITE_SOCKET_URL aren't set on the hosting platform.
export const ENV = {
  API_URL: import.meta.env.VITE_API_URL || 'https://mahala-uz.duckdns.org/api/v1',
  SOCKET_URL: import.meta.env.VITE_SOCKET_URL || 'https://mahala-uz.duckdns.org',
  MAP_DEFAULT: {
    lat: Number(import.meta.env.VITE_MAP_DEFAULT_LAT) || 41.2995,
    lng: Number(import.meta.env.VITE_MAP_DEFAULT_LNG) || 69.2401,
  },
  FIREBASE: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
  },
  IS_DEV: import.meta.env.DEV,
  // When true, auth runs fully offline (mock users in localStorage) so the whole
  // app is usable without a backend. Flip to false once the API is connected.
  MOCK_AUTH: import.meta.env.VITE_MOCK_AUTH === 'true',
};
