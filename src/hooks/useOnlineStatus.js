import { useSelector } from 'react-redux';

// Real-time presence, driven by the socket's `presence:update` event
// (see SocketProvider.jsx) — true whenever the given user id is currently
// connected, for both workers and residents alike.
export const useIsOnline = (userId) => {
  const onlineIds = useSelector((s) => s.chat.onlineUserIds);
  return !!userId && onlineIds.includes(userId);
};
