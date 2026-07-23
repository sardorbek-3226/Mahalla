import { createContext, useContext, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { connectSocket, disconnectSocket, getSocket, SOCKET_EVENTS } from '@/socket/socket';
import { useAuth } from '@/hooks/useAuth';
import { pushNotification } from '@/redux/slices/notificationSlice';
import { setOnlineUsers, setTyping, incrementUnread } from '@/redux/slices/chatSlice';
import { playMessageSound, playOrderSound } from '@/utils/sound';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

// Owns the socket lifecycle: connects when authenticated, wires global events
// into Redux, and tears down on logout.
export const SocketProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const dispatch = useDispatch();
  const socketRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated) {
      disconnectSocket();
      return;
    }

    const socket = connectSocket();
    socketRef.current = socket;

    socket.on(SOCKET_EVENTS.NOTIFICATION_NEW, (payload) => {
      dispatch(pushNotification(payload));
      // Rings for new orders and any other server-pushed alert — plays even
      // while the tab is in the background, as long as it's still open.
      playOrderSound();
    });
    socket.on(SOCKET_EVENTS.PRESENCE_UPDATE, (ids) => {
      dispatch(setOnlineUsers(Array.isArray(ids) ? ids : ids?.online || []));
    });
    socket.on(SOCKET_EVENTS.TYPING, (payload) => {
      dispatch(setTyping(payload));
    });
    socket.on(SOCKET_EVENTS.MESSAGE_NEW, (msg) => {
      if (msg?.conversation_id) dispatch(incrementUnread(msg.conversation_id));
      // Don't ring for your own message echoing back.
      if (msg?.sender_id && msg.sender_id !== user?.id) playMessageSound();
    });

    return () => {
      socket.off(SOCKET_EVENTS.NOTIFICATION_NEW);
      socket.off(SOCKET_EVENTS.PRESENCE_UPDATE);
      socket.off(SOCKET_EVENTS.TYPING);
      socket.off(SOCKET_EVENTS.MESSAGE_NEW);
    };
  }, [isAuthenticated, user?.id, dispatch]);

  return (
    <SocketContext.Provider value={{ socket: getSocket() }}>{children}</SocketContext.Provider>
  );
};
