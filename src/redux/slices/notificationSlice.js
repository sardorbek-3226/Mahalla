import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  unreadCount: 0,
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotifications(state, action) {
      state.items = action.payload;
      state.unreadCount = action.payload.filter((n) => !n.is_read).length;
    },
    pushNotification(state, action) {
      state.items.unshift(action.payload);
      if (!action.payload.is_read) state.unreadCount += 1;
    },
    markRead(state, action) {
      const item = state.items.find((n) => n.id === action.payload);
      if (item && !item.is_read) {
        item.is_read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllRead(state) {
      state.items.forEach((n) => (n.is_read = true));
      state.unreadCount = 0;
    },
  },
});

export const { setNotifications, pushNotification, markRead, markAllRead } =
  notificationSlice.actions;
export default notificationSlice.reducer;
