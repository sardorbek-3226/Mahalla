import { io } from 'socket.io-client';
import { ENV } from '@/config/env';
import { tokenStore } from '@/api/axiosInstance';

// Bearer-token auth: the backend has no session cookie, so the access token
// is sent in the handshake (`auth.token`) for the gateway to verify.
let socket = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(ENV.SOCKET_URL, {
      autoConnect: false,
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1500,
      auth: (cb) => cb({ token: tokenStore.access }),
    });
  }
  return socket;
};

export const connectSocket = () => {
  const s = getSocket();
  s.auth = { token: tokenStore.access };
  if (!s.connected) s.connect();
  return s;
};

export const disconnectSocket = () => {
  if (socket?.connected) socket.disconnect();
};

// Socket event names (TZ §6). Keep in sync with backend gateway.
export const SOCKET_EVENTS = {
  MESSAGE_NEW: 'message:new',
  MESSAGE_SEEN: 'message:seen',
  TYPING: 'typing',
  ORDER_UPDATED: 'order:updated',
  PRESENCE_UPDATE: 'presence:update',
  NOTIFICATION_NEW: 'notification:new',
};
