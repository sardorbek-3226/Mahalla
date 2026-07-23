import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  HiOutlinePaperAirplane, HiMagnifyingGlass, HiCheck, HiArrowLeft, HiOutlineChatBubbleLeftRight,
} from 'react-icons/hi2';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/ui/Card';
import { Avatar, Input, EmptyState, Skeleton } from '@/components/ui';
import { chatService } from '@/services/chatService';
import { queryClient } from '@/config/queryClient';
import { useAuth } from '@/hooks/useAuth';
import { timeAgo } from '@/utils/format';

const Chat = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const onlineIds = useSelector((s) => s.chat.onlineUserIds);
  const [activeId, setActiveId] = useState(location.state?.conversationId || null);
  const [text, setText] = useState('');
  const endRef = useRef(null);

  const { data: convData, isLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => chatService.listConversations(),
    refetchInterval: 8000,
  });
  const conversations = convData?.items || convData || [];

  // Default to the first conversation once loaded, without an extra render pass.
  const currentActiveId = activeId ?? conversations[0]?.id ?? null;

  const { data: msgData } = useQuery({
    queryKey: ['messages', currentActiveId],
    queryFn: () => chatService.messages(currentActiveId),
    enabled: !!currentActiveId,
    refetchInterval: 5000,
  });
  // Backend returns newest-first (for pagination) — reverse to normal chat
  // reading order (oldest at top, newest at bottom) before rendering.
  const messages = [...(msgData?.items || msgData || [])].reverse();
  const active = conversations.find((c) => c.id === currentActiveId);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const send = useMutation({
    mutationFn: (body) => chatService.sendMessage(currentActiveId, { body }),
    onSuccess: () => {
      setText('');
      queryClient.invalidateQueries({ queryKey: ['messages', currentActiveId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });

  const onSubmit = (e) => {
    e.preventDefault();
    if (text.trim() && currentActiveId) send.mutate(text.trim());
  };

  return (
    <div>
      <button onClick={() => navigate(-1)} className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600">
        <HiArrowLeft className="h-4 w-4" /> {t('chat.back')}
      </button>
      <PageHeader title={t('chat.title')} subtitle={t('chat.subtitle')} />

      <Card className="grid h-[70vh] grid-cols-1 overflow-hidden p-0 md:grid-cols-[300px_1fr]">
        {/* Conversation list */}
        <div className="hidden flex-col border-r border-gray-100 dark:border-gray-800 md:flex">
          <div className="p-3">
            <Input placeholder={t('chat.searchPlaceholder')} leftIcon={<HiMagnifyingGlass className="h-4 w-4" />} />
          </div>
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="space-y-2 p-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 rounded-xl" />)}</div>
            ) : conversations.length === 0 ? (
              <p className="p-4 text-center text-sm text-gray-400">{t('chat.noConversations')}</p>
            ) : (
              conversations.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveId(c.id)}
                  className={`flex w-full items-center gap-3 px-3 py-3 text-left transition hover:bg-gray-50 dark:hover:bg-gray-800/50 ${currentActiveId === c.id ? 'bg-primary-50 dark:bg-primary-900/20' : ''}`}
                >
                  <Avatar name={c.name} src={c.avatar_url} size="sm" online={onlineIds.includes(c.participant_id)} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{c.name}</p>
                    <p className="truncate text-xs text-gray-400">{c.last_message || t('chat.noMessage')}</p>
                  </div>
                  {c.unread > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-600 px-1.5 text-xs font-bold text-white">{c.unread}</span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Thread */}
        <div className="flex flex-col">
          {!active ? (
            <div className="flex flex-1 items-center justify-center">
              <EmptyState icon={HiOutlineChatBubbleLeftRight} title={t('chat.selectConversation')} description={t('chat.selectConversationHint')} />
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3 dark:border-gray-800">
                <Avatar name={active.name} src={active.avatar_url} size="sm" online={onlineIds.includes(active.participant_id)} />
                <div>
                  <p className="text-sm font-semibold">{active.name}</p>
                  <p className={`text-xs ${onlineIds.includes(active.participant_id) ? 'text-green-600' : 'text-gray-400'}`}>
                    {onlineIds.includes(active.participant_id)
                      ? t('chat.online')
                      : active.last_message_at
                        ? t('chat.lastActive', { time: timeAgo(active.last_message_at) })
                        : t('chat.offline')}
                  </p>
                </div>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto bg-gray-50/50 p-4 dark:bg-gray-900/30">
                {messages.map((m) => {
                  const mine = m.sender_id === user?.id;
                  return (
                    <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${mine ? 'bg-primary-600 text-white' : 'bg-white text-gray-800 shadow-soft dark:bg-gray-800 dark:text-gray-100'}`}>
                        <p>{m.body}</p>
                        <span className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${mine ? 'text-white/70' : 'text-gray-400'}`}>
                          {timeAgo(m.created_at)} {mine && m.is_read && <HiCheck className="h-3 w-3" />}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div ref={endRef} />
              </div>

              <form onSubmit={onSubmit} className="flex items-center gap-2 border-t border-gray-100 p-3 dark:border-gray-800">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={t('chat.messagePlaceholder')}
                  className="input-base flex-1"
                />
                <button type="submit" disabled={send.isPending} className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-600 text-white transition hover:bg-primary-700 disabled:opacity-60">
                  <HiOutlinePaperAirplane className="h-5 w-5" />
                </button>
              </form>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Chat;
