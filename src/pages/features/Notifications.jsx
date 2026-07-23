import { useQuery, useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import {
  HiOutlineBell,
  HiOutlineClipboardDocumentList,
  HiOutlineChatBubbleLeftRight,
  HiOutlineBanknotes,
  HiOutlineMegaphone,
} from 'react-icons/hi2';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/ui/Card';
import { Button, Skeleton, EmptyState } from '@/components/ui';
import { notificationService } from '@/services/communityService';
import { queryClient } from '@/config/queryClient';
import { timeAgo } from '@/utils/format';

const ICONS = {
  order: HiOutlineClipboardDocumentList,
  chat: HiOutlineChatBubbleLeftRight,
  payment: HiOutlineBanknotes,
  announcement: HiOutlineMegaphone,
};

const Notifications = () => {
  const { t } = useTranslation();
  const { data, isLoading } = useQuery({ queryKey: ['notifications'], queryFn: () => notificationService.list() });
  const items = data?.items || data || [];

  const readAll = useMutation({
    mutationFn: () => notificationService.readAll(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });
  const readOne = useMutation({
    mutationFn: (id) => notificationService.read(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title={t('features.notifications.title')}
        actions={items.some((n) => !n.is_read) && <Button variant="outline" onClick={() => readAll.mutate()}>{t('features.notifications.markAllRead')}</Button>}
      />

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-2xl" />)}</div>
      ) : items.length === 0 ? (
        <EmptyState icon={HiOutlineBell} title={t('features.notifications.empty')} />
      ) : (
        <div className="space-y-2">
          {items.map((n) => {
            const Icon = ICONS[n.type] || HiOutlineBell;
            return (
              <Card
                key={n.id}
                onClick={() => !n.is_read && readOne.mutate(n.id)}
                className={`flex cursor-pointer items-start gap-3 p-4 ${n.is_read ? '' : 'border-l-4 border-l-primary-500'}`}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-900/30">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className={`text-sm ${n.is_read ? 'font-medium' : 'font-semibold'}`}>{n.title}</p>
                  <p className="text-sm text-gray-500">{n.body}</p>
                  <p className="mt-1 text-xs text-gray-400">{timeAgo(n.created_at)}</p>
                </div>
                {!n.is_read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary-500" />}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Notifications;
