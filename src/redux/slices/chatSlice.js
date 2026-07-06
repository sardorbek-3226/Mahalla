import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeConversationId: null,
  onlineUserIds: [],
  typingByConversation: {}, // { [conversationId]: [userId, ...] }
  unreadByConversation: {}, // { [conversationId]: count }
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setActiveConversation(state, action) {
      state.activeConversationId = action.payload;
    },
    setOnlineUsers(state, action) {
      state.onlineUserIds = action.payload;
    },
    setTyping(state, action) {
      const { conversationId, userId, isTyping } = action.payload;
      const list = state.typingByConversation[conversationId] || [];
      state.typingByConversation[conversationId] = isTyping
        ? [...new Set([...list, userId])]
        : list.filter((id) => id !== userId);
    },
    incrementUnread(state, action) {
      const id = action.payload;
      state.unreadByConversation[id] = (state.unreadByConversation[id] || 0) + 1;
    },
    clearUnread(state, action) {
      state.unreadByConversation[action.payload] = 0;
    },
  },
});

export const { setActiveConversation, setOnlineUsers, setTyping, incrementUnread, clearUnread } =
  chatSlice.actions;
export default chatSlice.reducer;
