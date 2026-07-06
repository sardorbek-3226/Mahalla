import { initializeApp, getApps } from 'firebase/app';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';
import { ENV } from './env';

let messaging = null;

// Initialize lazily and guard against missing config / unsupported browsers.
export const initFirebase = async () => {
  if (!ENV.FIREBASE.apiKey) return null;
  try {
    if (!(await isSupported())) return null;
    const app = getApps().length ? getApps()[0] : initializeApp(ENV.FIREBASE);
    messaging = getMessaging(app);
    return messaging;
  } catch {
    return null;
  }
};

// Request permission and return the FCM token to send to the backend.
export const requestPushToken = async () => {
  if (!messaging) await initFirebase();
  if (!messaging) return null;
  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return null;
    return await getToken(messaging, { vapidKey: ENV.FIREBASE.vapidKey });
  } catch {
    return null;
  }
};

// Foreground push handler.
export const onPushMessage = (callback) => {
  if (!messaging) return () => {};
  return onMessage(messaging, callback);
};
