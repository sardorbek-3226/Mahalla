import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { HiOutlineRectangleGroup, HiPlus, HiOutlineTrash, HiOutlinePencilSquare } from 'react-icons/hi2';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/ui/Card';
import { Input, Button, Modal, Skeleton, EmptyState } from '@/components/ui';
import { categoryService } from '@/services/workerService';
import { queryClient } from '@/config/queryClient';

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const CategoriesAdmin = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const { data, isLoading } = useQuery({ queryKey: ['categories'], queryFn: categoryService.list });
  const cats = data?.items || data || [];

  const openNew = () => { setEditing(null); reset({ name: '', slug: '', icon_url: '' }); setOpen(true); };
  const openEdit = (c) => { setEditing(c); reset({ name: c.name, slug: c.slug, icon_url: c.icon }); setOpen(true); };

  const save = useMutation({
    mutationFn: (payload) => {
      const body = { ...payload, slug: payload.slug || slugify(payload.name) };
      return editing ? categoryService.update(editing.id, body) : categoryService.create(body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success(editing ? t('admin.categoriesAdmin.updated') : t('admin.categoriesAdmin.created'));
      setOpen(false);
    },
    onError: (e) => toast.error(e.response?.data?.message || t('admin.categoriesAdmin.error')),
  });
  const remove = useMutation({
    mutationFn: (id) => categoryService.remove(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['categories'] }); toast.success(t('admin.categoriesAdmin.removed')); },
    onError: (e) => toast.error(e.response?.data?.message || t('admin.categoriesAdmin.removeError')),
  });

  return (
    <div>
      <PageHeader
        title={t('admin.categoriesAdmin.title')}
        subtitle={t('admin.categoriesAdmin.subtitle')}
        actions={<Button variant="gradient" leftIcon={<HiPlus className="h-4 w-4" />} onClick={openNew}>{t('admin.categoriesAdmin.category')}</Button>}
      />

      {isLoading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-2xl" />)}</div>
      ) : cats.length === 0 ? (
        <EmptyState icon={HiOutlineRectangleGroup} title={t('admin.categoriesAdmin.empty')} />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {cats.map((c) => (
            <Card key={c.id} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{c.icon}</span>
                <div>
                  <p className="font-medium">{c.name}</p>
                  <p className="text-xs text-gray-400">{c.slug} · {t('admin.categoriesAdmin.mastersCount', { count: c.count })}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => openEdit(c)} className="rounded-lg p-2 text-gray-400 hover:text-primary-600"><HiOutlinePencilSquare className="h-5 w-5" /></button>
                <button onClick={() => remove.mutate(c.id)} className="rounded-lg p-2 text-gray-400 hover:text-red-500"><HiOutlineTrash className="h-5 w-5" /></button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? t('admin.categoriesAdmin.editTitle') : t('admin.categoriesAdmin.newTitle')}>
        <form onSubmit={handleSubmit(save.mutate)} className="space-y-4">
          <Input label={t('admin.categoriesAdmin.name')} error={errors.name?.message} {...register('name', { required: t('admin.categoriesAdmin.nameRequired') })} />
          <Input label={t('admin.categoriesAdmin.slug')} hint={t('admin.categoriesAdmin.slugHint')} {...register('slug')} />
          <Input label={t('admin.categoriesAdmin.iconUrl')} {...register('icon_url')} />
          <Button type="submit" variant="gradient" className="w-full" loading={save.isPending}>{t('admin.categoriesAdmin.save')}</Button>
        </form>
      </Modal>
    </div>
  );
};

export default CategoriesAdmin;
