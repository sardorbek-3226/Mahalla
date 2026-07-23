import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { HiOutlineMegaphone, HiOutlineSparkles, HiPlus, HiOutlineTrash } from 'react-icons/hi2';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/ui/Card';
import { Badge, Button, Input, Modal, Skeleton, EmptyState } from '@/components/ui';
import { newsService } from '@/services/communityService';
import { queryClient } from '@/config/queryClient';
import { usePermissions } from '@/hooks/usePermissions';
import { PERMISSIONS } from '@/constants/permissions';
import { timeAgo } from '@/utils/format';

const News = () => {
  const { t } = useTranslation();
  const { user, can } = usePermissions();
  const mahallaId = user?.mahalla_id;
  const canPublish = can(PERMISSIONS.NEWS_PUBLISH);
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: { type: 'announcement' } });

  const { data, isLoading } = useQuery({
    queryKey: ['announcements', mahallaId],
    queryFn: () => newsService.list(mahallaId),
  });
  const items = data?.items || data || [];

  const create = useMutation({
    mutationFn: (payload) => newsService.create({ ...payload, mahalla_id: mahallaId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements', mahallaId] });
      toast.success(t('features.news.createSuccess'));
      reset();
      setOpen(false);
    },
    onError: (e) => toast.error(e.response?.data?.message || t('features.news.genericError')),
  });
  const remove = useMutation({
    mutationFn: (id) => newsService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements', mahallaId] });
      toast.success(t('features.news.deleteSuccess'));
    },
  });

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title={t('features.news.title')}
        subtitle={t('features.news.subtitle')}
        actions={canPublish && mahallaId && (
          <Button variant="gradient" leftIcon={<HiPlus className="h-4 w-4" />} onClick={() => setOpen(true)}>{t('features.news.addButton')}</Button>
        )}
      />

      {!mahallaId && (
        <Card className="mb-5 border-l-4 border-l-amber-400 p-4 text-sm text-gray-600 dark:text-gray-300">
          {t('features.news.noMahalla')}
        </Card>
      )}

      {isLoading ? (
        <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}</div>
      ) : items.length === 0 ? (
        <EmptyState icon={HiOutlineMegaphone} title={t('features.news.empty')} />
      ) : (
        <div className="space-y-4">
          {items.map((n) => {
            const isRec = n.type === 'recommendation';
            const Icon = isRec ? HiOutlineSparkles : HiOutlineMegaphone;
            return (
              <Card key={n.id} className="p-5">
                <div className="flex items-start gap-4">
                  <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${isRec ? 'bg-accent-50 text-accent-600 dark:bg-accent-900/30' : 'bg-primary-50 text-primary-600 dark:bg-primary-900/30'}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{n.title}</h3>
                      <Badge tone={isRec ? 'blue' : 'green'}>{isRec ? t('features.news.recommendation') : t('features.news.announcement')}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{n.body}</p>
                    <p className="mt-2 text-xs text-gray-400">{n.author_name} · {timeAgo(n.created_at)}</p>
                  </div>
                  {canPublish && (
                    <button onClick={() => remove.mutate(n.id)} className="text-gray-400 hover:text-red-500">
                      <HiOutlineTrash className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={t('features.news.newModalTitle')}>
        <form onSubmit={handleSubmit(create.mutate)} className="space-y-4">
          <Input label={t('features.news.titleLabel')} error={errors.title?.message} {...register('title', { required: t('features.news.titleRequired') })} />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">{t('features.news.typeLabel')}</label>
            <select className="input-base" {...register('type')}>
              <option value="announcement">{t('features.news.announcement')}</option>
              <option value="recommendation">{t('features.news.recommendation')}</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">{t('features.news.bodyLabel')}</label>
            <textarea rows={4} className="input-base resize-none" {...register('body', { required: true })} />
          </div>
          <Button type="submit" variant="gradient" className="w-full" loading={create.isPending}>{t('features.news.publish')}</Button>
        </form>
      </Modal>
    </div>
  );
};

export default News;
