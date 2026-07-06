import api from '@/api/axiosInstance';
import { ENDPOINTS } from '@/api/endpoints';
import { normalizeConversation, normalizeMessage, mapList } from '@/api/normalizers';

// Real-time chat (swagger: Chat tag). Bearer-protected.
export const chatService = {
  listConversations: () =>
    api.get(ENDPOINTS.CHAT.CONVERSATIONS).then((r) => mapList(r.data, normalizeConversation)),
  createConversation: ({ participant_id, order_id }) =>
    api
      .post(ENDPOINTS.CHAT.CONVERSATIONS, { participantId: participant_id, orderId: order_id })
      .then((r) => normalizeConversation(r.data)),
  messages: (conversationId, params) =>
    api.get(ENDPOINTS.CHAT.messages(conversationId), { params }).then((r) => mapList(r.data, normalizeMessage)),
  sendMessage: (conversationId, { body, attachment_url }) =>
    api
      .post(ENDPOINTS.CHAT.messages(conversationId), { body, attachmentUrl: attachment_url })
      .then((r) => normalizeMessage(r.data)),
};
